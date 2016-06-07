unit qtxdataset;

//#############################################################################
//
//  Unit:       qtxdataset.pas
//  Author:     Jon Lennart Aasenden [cipher diaz of quartex]
//  Copyright:  Jon Lennart Aasenden, all rights reserved
//
//  Description:
//  ============
//  Implements a small and fast in-memory dataset. Supports all the basic
//  dataset operations (including autoinc field type) but no SQL and
//  as of writing, no filtering scheme or regEx support.
//
//  _______           _______  _______ _________ _______
// (  ___  )|\     /|(  ___  )(  ____ )\__   __/(  ____ \|\     /|
// | (   ) || )   ( || (   ) || (    )|   ) (   | (    \/( \   / )
// | |   | || |   | || (___) || (____)|   | |   | (__     \ (_) /
// | |   | || |   | ||  ___  ||     __)   | |   |  __)     ) _ (
// | | /\| || |   | || (   ) || (\ (      | |   | (       / ( ) \
// | (_\ \ || (___) || )   ( || ) \ \__   | |   | (____/\( /   \ )
// (____\/_)(_______)|/     \||/   \__/   )_(   (_______/|/     \|
//
//
//#############################################################################

interface

uses
  System.Types, SmartCL.System, qtxutils;

type

  (* Forward declaration *)
  TQTXDatasetField  = Class;
  TQTXBooleanField  = Class;
  TQTXIntegerField  = Class;
  TQTXFloatField    = Class;
  TQTXStringField   = Class;
  TQTXDatasetFields = Class;
  TQTXDataset       = Class;
  TQTXFieldDef      = Class;
  TQTXFieldDefs     = Class;

  (* Exception classes *)
  EW3FieldDefs          = Class(EW3Exception);
  EW3DatasetField       = Class(EW3Exception);
  EW3Dataset            = Class(EW3Exception);

  TQTXDatasetPacket     = Variant;

  TQTXDatasetFieldType =
    (
        ftUnknown,
        ftBoolean,
        ftInteger,
        ftFloat,
        ftString,
        ftDateTime,
        ftAutoInc,    //  generated
        ftGUID        //  generated
    );

  TQTXDatasetState =(dsIdle,dsInsert,dsEdit);

  IDatasetFieldsAccess  = Interface
    Procedure  ResetValues;
    Procedure  setReadOnly(const aValue:Boolean);
  end;

  IFieldDefAccess = interface
    Procedure SetReadOnly(Const aValue:Boolean);
    function  getFieldIdentifier:String;
  end;

  TQTXDatasetField = Class(TObject)
  private
    FName:      String;
    FKind:      TQTXDatasetFieldType;
    FReadOnly:  Boolean;
    FValue:     Variant;
    FParent:    TQTXDatasetFields;
    Procedure   setAsDateTime(const aValue:TDateTime);
    function    getAsDateTime:TDateTime;
  protected
    Procedure   Generate;virtual;
    function    getGenerated:Boolean;virtual;
    function    getValue:Variant;virtual;
    procedure   setValue(const aValue:variant);virtual;
    procedure   setName (const aValue:String);
    procedure   setKind (const aKind:TQTXDatasetFieldType);
    Procedure   setReadOnly(const aValue:Boolean);
  public
    Property    Parent:TQTXDatasetFields read FParent;
    Property    Kind:TQTXDatasetFieldType read FKind;
    Property    Name:String read FName write setName;
    Property    Data:Variant read getValue write setValue;
    Property    Generated:Boolean read getGenerated;

    Property    AsString:String
                read (TVariant.AsString(FValue))
                write (FValue:=Value);

    Property    AsInteger:Integer
                read (TVariant.asInteger(FValue))
                write (FValue:=Value);

    Property    AsBoolean:Boolean
                read (TVariant.AsBool(FValue))
                write (FValue:=Value);

    Property    AsFloat:Float
                read (TVariant.asFloat(FValue))
                write (FValue:=Value);

    Property    AsDateTime:TDateTime
                read  getAsDateTime
                write setAsDateTime;

    Constructor Create(const aParent:TQTXDatasetFields);virtual;
  End;

  TQTXAutoIncField = Class(TQTXDatasetField)
  private
    FCalc:    Integer;
  protected
    Procedure Generate;override;
    function  getGenerated:Boolean;override;
  public
    Property  Value:Integer
              read (TVariant.AsInteger(Inherited getValue));
  End;

  TQTXGUIDField = Class(TQTXDatasetField)
  protected
    Procedure Generate;override;
    function  getGenerated:Boolean;override;
  public
    Property  Value:String
              read (TVariant.asString(Inherited getValue));
  End;

  TQTXBooleanField = Class(TQTXDatasetField)
  public
    Property  Value:Boolean
              read (TVariant.AsBool(Inherited getValue))
              write (inherited setValue(Value));
  End;

  TQTXIntegerField = Class(TQTXDatasetField)
  public
    Property  Value:Integer
              read (TVariant.AsInteger(Inherited getValue))
              write (inherited setValue(Value));
  end;

  TQTXFloatField = Class(TQTXDatasetField)
  public
    Property  Value:Float
              read (TVariant.AsFloat(Inherited getValue))
              write (inherited setValue(Value));
  end;

  TQTXStringField = Class(TQTXDatasetField)
  public
    Property  Value:String
              read (TVariant.AsString(Inherited getValue))
              write (inherited setValue(Value));
  end;

  TQTXDateTimeField = Class(TQTXDatasetField)
  protected
    function  getValue:TDateTime;reintroduce;
    procedure setValue(const aValue:TDateTime);reintroduce;
  public
    Property  Value:TDateTime read getValue write setValue;
  End;

  TQTXDatasetFields = Class(TObject,IDatasetFieldsAccess)
  private
    FFields:    Array of TQTXDatasetField;
  protected
    (* IMPLEMENTS:: IDatasetFieldsAccess *)
    Procedure   ResetValues;
    Procedure   setReadOnly(const aValue:Boolean);
  public
    Property    Count:Integer read (FFields.count);
    Property    Items[index:Integer]:TQTXDatasetField read (FFields[index]);
    function    DataExport:TQTXDatasetPacket;virtual;
    Procedure   DataImport(const aValue:TQTXDatasetPacket);virtual;
    function    IndexOf(aName:String):Integer;
    function    Add(aName:String;
                const aKind:TQTXDatasetFieldType):TQTXDatasetField;
    Procedure   DeleteByName(aName:String);
    Procedure   Delete(const aIndex:Integer);
    Procedure   Clear;
    function    FieldByName(aName:String):TQTXDatasetField;
    Destructor  Destroy;Override;
  End;

  TQTXFieldDef = Class(Tobject)
  private
    FDatatype:  TQTXDatasetFieldType;
    FName:      String;
    FReadOnly:  Boolean;
    FParent:    TQTXFieldDefs;
    Procedure   setType(const aValue:TQTXDatasetFieldType);
    Procedure   setName(const aName:String);
  protected
    Procedure   setReadOnly(const aValue:Boolean);
  public
    Property    Name:String read FName write setName;
    Property    Datatype:TQTXDatasetFieldType read FDatatype write setType;
    Constructor Create(Const aParent:TQTXFieldDefs);virtual;
  End;

  TQTXFieldDefs = Class(TObject,IFieldDefAccess)
  private
    FFields:    Array of TQTXFieldDef;
    FId:        Integer;
    FReadOnly:  Boolean;
  protected
    function    getFieldIdentifier:String;virtual;
    Procedure   SetReadOnly(Const aValue:Boolean);
  public
    Property    ReadOnly:Boolean read FReadOnly;
    Property    Fields[index:Integer]:TQTXFieldDef
                read (FFields[index]);default;

    Property    Count:Integer read (FFields.Count);

    function    Add(aName:String;
                const aDataType:TQTXDatasetFieldType):TQTXFieldDef;

    function    FieldByName(aName:String):TQTXFieldDef;
    Function    IndexOf(aName:String):Integer;
    Procedure   Delete(const aIndex:Integer);overload;
    procedure   Delete(const aItem:TQTXFieldDef);overload;

    function    SaveToString:String;
    Procedure   LoadFromString(const aText:String);

    function    toString:String;virtual;

    Procedure   Clear;
    Destructor  Destroy;Override;
  End;

  TDatasetStateChangeEvent = Procedure (sender:TObject;const aState:TQTXDatasetState);
  TDatasetPositionChangeEvent = procedure (sender:TObject;aOldPos,aNewPos:Integer);
  TDatasetRecordDeleteEvent   = Procedure (sender:TObject;const aRecNo:Integer);

  TQTXDataset = Class(TObject)
  private
    FFields:    TQTXDatasetFields;
    FDefs:      TQTXFieldDefs;
    FCache:     Array of TQTXDatasetPacket;
    FState:     TQTXDatasetState;
    FActive:    Boolean;
    FDestroying:Boolean;

    FOnCreated: TNotifyEvent;
    FOnClosed:  TNotifyEvent;
    FOnState:   TDatasetStateChangeEvent;
    FOnPos:     TDatasetPositionChangeEvent;
    FOnDelete:  TDatasetRecordDeleteEvent;

    FDsIndex:   Integer;

    Procedure   UpdateGeneratedFields;

    procedure   setActive(const aValue:Boolean);
    Procedure   setPosition(const aNewPosition:Integer);
  protected
    Procedure   DoBeforeDatasetCreated;virtual;
    Procedure   DoAfterDatasetCreated;virtual;
    Procedure   DoBeforeDatasetClosed;virtual;
    Procedure   DoAfterDatasetClosed;virtual;

    function    getRecCount:Integer;virtual;
    function    getRecNo:Integer;virtual;
    function    getEOF:Boolean;virtual;
    function    getBOF:Boolean;virtual;

    procedure   getPacketToFields;virtual;
    Procedure   setPacketFromFields;virtual;

    procedure   setState(const aState:TQTXDatasetState);
  public
    Property    Active:Boolean read FActive write setActive;
    Property    State:TQTXDatasetState read FState;
    Property    Fields:TQTXDatasetFields read FFields;
    Property    FieldDefs:TQTXFieldDefs
                read FDefs;

    Property    EOF:Boolean read getEOF;
    Property    BOF:Boolean read getBOF;
    Property    Count:Integer read getRecCount;
    Property    RecNo:Integer read getRecNo;

    // Save and Load to JSON format
    function    SaveToString:String;
    Procedure   LoadFromString(Const aText:String);

    Procedure   Append; //Add record LAST always
    procedure   Insert; //Add record at position
    Procedure   Delete; //Delete record at position
    Procedure   Post;   //Complete insertion or update
    procedure   Edit;   //Edit record at position

    Procedure   Next;   //Navigate 1 step forward
    Procedure   Back;   //Navigate 1 step back
    Procedure   First;  //Navigate to first record
    Procedure   Last;   //Navigate to last record
    Procedure   MoveTo(const aRecNo:Integer); //Navigate directly

    Procedure   CreateDataset;
    Procedure   Close;

    Procedure   Cancel;

    class function Version:String;

    Constructor Create;virtual;
    Destructor  Destroy;Override;
  published

    Property    OnRecordDeleted:TDatasetRecordDeleteEvent
                read FOnDelete write FOnDelete;

    Property    OnDatasetCreated:TNotifyEvent read FOnCreated write FOnCreated;
    Property    OnDatasetClosed:TNotifyevent read FOnClosed write FOnClosed;

    Property    OnStateChanged:TDatasetStateChangeEvent
                read FOnState write FOnState;

    Property    OnPositionChanged:TDatasetPositionChangeEvent
                read FOnPos write FOnPos;
  end;

implementation

const
CNT_DATASET_MAJOR = 0;
CNT_DATASET_MINOR = 1;

resourcestring
CNT_DATASET_FIELD_READONLY  = 'Failed to alter value, field is read-only error';
CNT_DATASET_NOT_ACTIVE      = 'Operation failed, dataset is not active error';
CNT_DATASET_INVALID_STATE   = 'Invalid state for operation error';
CNT_DATASET_FIELD_UNKNOWN   = 'Failed to match field class for datatype error';

CNT_DATASET_FIELDEF_LIVE    = 'Field definition cannot be altered in a live dataset error';

//#############################################################################
// Internal records used for storage etc.
//#############################################################################

type

TQTXFieldDefData = Record
  fdName: String;
  fdDatatype: TQTXDatasetFieldType;
End;

TQTXFieldDefHeader = Record
  ddMagic:  Integer;
  ddDefs:   Array of TQTXFieldDefData;
End;

TQTXDatasetHeader  = Record
  dhMagic:      Integer;
  dhCount:      Integer;
  dhFieldDefs:  String;
  dhData:       String;
End;

//#############################################################################
// TQTXFieldDefs
//#############################################################################

Destructor TQTXFieldDefs.Destroy;
begin
  if FFields.Count>0 then
  Clear;
  inherited;
end;

Procedure TQTXFieldDefs.clear;
var
  x:  Integer;
begin
  if FFields.Count>0 then
  Begin
    try
      for x:=FFields.low to FFields.high do
      FFields[x].free;
    finally
      FFields.clear;
    end;
  end;
end;

function TQTXFieldDefs.getFieldIdentifier:String;
Begin
  repeat
    inc(FId);
    result:='Field' + FId.toString;
  until IndexOf(result)<0;
end;

Procedure TQTXFieldDefs.SetReadOnly(Const aValue:Boolean);
var
  mItem:  TQTXFieldDef;
Begin
  FReadOnly:=aValue;
  if FFields.length>0 then
  for mItem in FFields do
  mItem.setReadOnly(aValue);
end;

function  TQTXFieldDefs.Add(aName:String;
          const aDataType:TQTXDatasetFieldType):TQTXFieldDef;
Begin
  result:=NIL;
  if not FReadOnly then
  begin
    aName:=trim(lowercase(aName));
    if aName.length>0 then
    Begin
      if indexOf(aName)<0 then
      Begin
        result:=TQTXFieldDef.Create(self);
        result.name:=aName;
        result.datatype:=aDataType;
        FFields.add(result);
      end else
      raise EW3FieldDefs.Create('A field with that name already exists error');
    end else
    raise EW3FieldDefs.create('Failed to add field definition, invalid name error');
  end else
  raise EW3FieldDefs.create(CNT_DATASET_FIELDEF_LIVE);
end;

function  TQTXFieldDefs.FieldByName(aName:String):TQTXFieldDef;
var
  x:  Integer;
Begin
  result:=NIL;
  if FFields.Length>0 then
  begin
    aName:=lowercase(trim(aName));
    if length(aName)>0 then
    begin
      for x:=FFields.low to FFields.high do
      Begin
        if aName = lowercase(FFields[x].name) then
        begin
          result:=FFields[x];
          break;
        end;
      end;
    end;
  end;
end;

Function  TQTXFieldDefs.IndexOf(aName:String):Integer;
var
  x:  Integer;
Begin
  result:=-1;
  if FFields.Length>0 then
  begin
    aName:=lowercase(trim(aName));
    if length(aName)>0 then
    begin
      for x:=FFields.low to FFields.high do
      Begin
        if aName = lowercase(FFields[x].name) then
        begin
          result:=x;
          break;
        end;
      end;
    end;
  end;
end;

Procedure TQTXFieldDefs.Delete(const aIndex:Integer);
Begin
  if not FReadOnly then
  begin
    If (aIndex>=0) and (aIndex<FFields.length) then
    Begin
      FFields[aIndex].free;
      FFields.Delete(aIndex,1);
    end;
  end else
  raise EW3FieldDefs.create(CNT_DATASET_FIELDEF_LIVE);
end;

procedure TQTXFieldDefs.Delete(const aItem:TQTXFieldDef);
Begin
  if aItem<>NIL then
  Delete(IndexOf(aItem.Name)) else
  raise EW3FieldDefs.create('Delete operation failed, reference was NIL error');
end;

function TQTXFieldDefs.SaveToString:String;
var
  x:  Integer;
  mHead:  TQTXFieldDefHeader;
Begin
  mHead.ddMagic:=$BABE;
  if FFields.Count>0 then
  Begin
    mHead.ddDefs.SetLength(FFields.Count);
    for x:=FFields.low to FFields.high do
    Begin
      mHead.ddDefs[x].fdDatatype:=FFields[x].dataType;
      mHead.ddDefs[x].fdName:=FFields[x].Name;
    end;
  end;
  asm
    @result = JSON.stringify(@mHead);
  end;
end;

Procedure TQTXFieldDefs.LoadFromString(Const aText:String);
var
  mHead:  TQTXFieldDefHeader;
  x:  Integer;
Begin
  Clear;

  try
    asm
      @mHead = JSON.parse(@aText);
    end;
  except
    On e: exception do
    Raise EW3FieldDefs.CreateFmt
    ('Failed to load field-definitions, system threw exception: %s',[e.message]);
  end;

  if mHead.ddMagic=$BABE then
  Begin
    if mHead.ddDefs.count>0 then
    begin
      for x:=mHead.ddDefs.low to mHead.ddDefs.high do
      Add(mHead.ddDefs[x].fdName,mHead.ddDefs[x].fdDatatype);
    end;
  end else
  Raise EW3FieldDefs.Create('Failed to load field-definitions, invalid header signature error');
end;

function  TQTXFieldDefs.toString:String;
var
  x:  Integer;
Begin
  if FFields.Count>0 then
  Begin
    for x:=FFields.low to FFields.high do
    Begin
      result+='Name=' + '"' + FFields[x].Name + '"' + ' Datatype=';
      case FFields[x].Datatype of
      ftUnknown:  result+='Unknown';
      ftBoolean:  result+='Boolean';
      ftInteger:  result+='Integer';
      ftFloat:    result+='Float';
      ftString:   result+='String';
      ftDateTime: result+='DateTime';
      ftAutoInc:  result+='AutoInc';
      ftGUID:     result+='GUID';
      end;
      result:=result + #13;
    end;
  end;
end;

//#############################################################################
// TQTXFieldDef
//#############################################################################

Constructor TQTXFieldDef.Create(Const aParent:TQTXFieldDefs);
Begin
  inherited Create;
  if aParent<>NIL then
  begin
    FParent:=aParent;
    FName:=(FParent as IFieldDefAccess).getFieldIdentifier;
  end;
end;

Procedure TQTXFieldDef.setReadOnly(const aValue:Boolean);
Begin
  FReadOnly:=aValue;
end;

Procedure TQTXFieldDef.setType(const aValue:TQTXDatasetFieldType);
begin
  if not FReadOnly then
  FDatatype:=aValue;
end;

Procedure TQTXFieldDef.setName(const aName:String);
Begin
  if not FReadOnly then
  Begin
    FName:=aName;
  end;
end;

//#############################################################################
// TQTXDataset
//#############################################################################

Constructor TQTXDataset.Create;
Begin
  inherited Create;
  FFields:=TQTXDatasetFields.Create;
  FDefs:=TQTXFieldDefs.Create;
  FState:=dsIdle;
  FDestroying:=False;
  FDsIndex:=-1;
end;

Destructor  TQTXDataset.Destroy;
Begin
  FDestroying:=true;

  if FActive then
  Close;

  FFields.free;
  FDefs.free;

  inherited;
end;

Class function TQTXDataset.Version:String;
Begin
  result:=IntToStr(CNT_DATASET_MAJOR) + '.' + IntToStr(CNT_DATASET_MINOR);
end;

Function TQTXDataset.saveToString:String;
var
  mHead:  TQTXDatasetHeader;
Begin
  if FActive then
  Begin
    try
      (* Setup the header *)
      mHead.dhMagic:=$CAFE;
      mHead.dhCount:=getRecCount;

      (* Serialize and store field-defs *)
      mHead.dhFieldDefs:=EncodeURI(FDefs.SaveToString);

      (* Serialize and store dataset records *)
      asm
        (@mHead).dhData = JSON.stringify((@self).FCache);
      end;

      (* Now serialize and return text representation of data structure *)
      asm
        @result = JSON.stringify(@mHead);
      end;

    except
      on e: exception do
      raise EW3Dataset.CreateFmt
      ('Failed to store dataset, system threw exception: %s',[e.message]);
    end;

  end;
end;

Procedure TQTXDataset.LoadFromString(Const aText:String);
var
  mHead:  TQTXDatasetHeader;
Begin
  (* If the dataset is active, close it down *)
  if FActive then
  Close;

  (* Check source string *)
  if aText.Length>0 then
  Begin
    (* Attempt to de-serialize JSON data *)
    try
      asm
        @mHead = JSON.parse(@aText);
      end;
    except
      on e: exception do
      Raise EW3Dataset.CreateFmt
      ('Failed to load dataset, system threw exception: %s',[e.message]);
    end;

    (* Verify header *)
    if mHead.dhMagic=$CAFE then
    Begin
      (* Load DEFS if any *)
      if mHead.dhFieldDefs.Length>0 then
      FDefs.LoadFromString(DecodeURI(mHead.dhFieldDefs));

      (* Any actual rows? ok, try to load them *)
      if mHead.dhCount>0 then
      Begin
        try
          asm
            (@self).FCache = JSON.parse((@mHead).dhData);
          end;
        except
          on e: exception do
          Raise EW3Dataset.CreateFmt
          ('Failed to load dataset, system threw exception: %s',[e.message]);
        end;
      end;

    end else
    Raise EW3Dataset.Create('Failed to load dataset, invalid header signature error');

  end else
  Raise EW3Dataset.Create('Failed to load dataset, string was empty error');

end;

Procedure TQTXDataset.CreateDataset;

  Procedure SetupFields;
  var
    x:  Integer;
  begin
    for x:=0 to FDefs.Count-1 do
    FFields.add(FDefs[x].Name,FDefs[x].Datatype);
  end;

Begin
  if not FActive then
  Begin

    if FDefs.Count>0 then
    Begin
      (* Clear any fields if the user has added some.
         All fields are created from filed-defs *)
      FFields.Clear;

      DoBeforeDatasetCreated;
      try
        FActive:=True;
        setState(dsIdle);
        setPosition(-1);

        (* Import table schema to field construct *)
        SetupFields;

        (* Lock fields & defs, read/write access to defined
           structure only. No alteration while the dataset
           is "live" *)
        (FFields as IDatasetFieldsAccess).setReadOnly(true);
        (FDefs as IFieldDefAccess).setReadOnly(true);

      finally
        DoAfterDatasetCreated;
      end;

    end else
    Raise EW3Dataset.Create('No field definitions for dataset error');
  end;
end;

Procedure TQTXDataset.Close;
begin
  if FActive then
  Begin
    DoBeforeDatasetClosed;
    try
      try
        FFields.Clear;
        FCache.Clear;
      finally
        FActive:=False;
        FState:=dsIdle;
        FDsIndex:=-1;
        (FFields as IDatasetFieldsAccess).resetValues;
        (FFields as IDatasetFieldsAccess).setReadOnly(False);
        (FDefs as IFieldDefAccess).setReadOnly(False);
      end;
    finally
      DoAfterDatasetClosed;
    end;
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

procedure TQTXDataset.setState(const aState:TQTXDatasetState);
Begin
  FState:=aState;
  if assigned(FOnState) then
  FOnState(self,aState);
end;

Procedure TQTXDataset.getPacketToFields;
Begin
  if (FdsIndex>=0) and (FdsIndex<FCache.Length) then
  FFields.DataImport(FCache[FdsIndex]);
end;

Procedure TQTXDataset.setPacketFromFields;
Begin
  if (FdsIndex>=0) and (FdsIndex<FCache.Length) then
  FCache[FDsIndex]:=FFields.DataExport;
end;

Procedure TQTXDataset.setPosition(const aNewPosition:Integer);
var
  mOld: Integer;
Begin
  if aNewPosition<>FdsIndex then
  begin
    mOld:=FdsIndex;
    FDsIndex:=aNewPosition;

    if not (FState=dsInsert) then
    Begin
      if (FdsIndex>=0)
      and (FdsIndex<getRecCount) then
      getPacketToFields;
    end;

    if assigned(FOnPos) then
    FOnPos(self,mOld,aNewPosition);
  end;
end;

procedure TQTXDataset.setActive(const aValue:Boolean);
Begin
  if aValue<>FActive then
  begin
    Case aValue of
    true:   CreateDataset;
    false:  Close;
    end;
  end;
end;

Procedure TQTXDataset.UpdateGeneratedFields;
var
  x:  Integer;
Begin
  for x:=0 to FFields.Count-1 do
  if FFields.Items[x].Generated then
  FFields.items[x].Generate;
end;

Procedure TQTXDataset.Append;
Begin
  if FActive then
  Begin
    if FState=dsIdle then
    Begin
      //Actual items + 1
      self.setPosition(FCache.Count);
      //Last;
      setState(dsInsert);
      (FFields as IDatasetFieldsAccess).resetValues;
      UpdateGeneratedFields;
    end else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

procedure TQTXDataset.Insert;
Begin
  if FActive then
  Begin
    if FState=dsIdle then
    Begin
      if (RecNo<0) then
      setPosition(FCache.Count);
      setState(dsInsert);
      (FFields as IDatasetFieldsAccess).resetValues;
      UpdateGeneratedFields;
    end else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

procedure TQTXDataset.Edit;
Begin
  if FActive then
  Begin
    if FState=dsIdle then
    Begin
      if FCache.Length>0 then
      Begin
        if  (FdsIndex=-1) then
        self.setPosition(0) else

        if (FdsIndex=FCache.length) then
        setPosition(FCache.length-1);

        setState(dsEdit);
        UpdateGeneratedFields;
      end;
    end else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

Procedure TQTXDataset.Delete;
Begin
  if FActive then
  Begin
    if FState=dsIdle then
    begin
      if Count>0 then
      Begin
        if (FdsIndex>=0) and (FdsIndex<FCache.count) then
        Begin

          (* Signal satan that his work is done *)
          if assigned(FOnDelete) then
          FOnDelete(self,FdsIndex);

          (* Delete record *)
          FCache.Delete(FdsIndex,1);

          (* Misaligned recno? Backtrack. This will fall back to -1,
             which is BOF, when the last record is deleted *)
          if FdsIndex>=FCache.Count then
          FdsIndex:=FCache.Count-1;

        end else
        raise EW3Dataset.CreateFmt('Delete failed, misaligned RecNo [%s]',[FdsIndex]);
      end else
      Raise EW3Dataset.Create('Delete failed, dataset is empty error');
    end else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

Procedure TQTXDataset.Cancel;
Begin
  if FActive then
  begin
    if (FState=dsInsert)
    or (FState=dsEdit) then
    begin
      setState(dsIdle);
      (FFields as IDatasetFieldsAccess).resetValues;
    end else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

{$HINTS OFF}
Procedure TQTXDataset.Post;
var
  mDummy: TQTXDatasetPacket;
Begin
  if FActive then
  Begin

    Case FState of
    dsInsert:
      Begin
        (* Grow the internal cache *)
        if FdsIndex=getRecCount then
        Begin
          (* Insert at end of Dataset (a.k.a "Append") *)
          FCache.Add(mDummy);
          FdsIndex:=FCache.Length-1;
        end else
        (* insert "directly" at position *)
        FCache.Insert(FDsIndex,mDummy);

        (* Write data to record pointer *)
        setPacketFromFields;

        (* position record PTR on last record *)
        //setPosition(FCache.Count-1);

        (* set state to idle *)
        setState(dsIdle);

      end;
    dsEdit:
      begin
        setPacketFromFields;
        setState(dsIdle);
      end;
    else
      raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
    end;

  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;
{$HINTS ON}

Procedure TQTXDataset.First;
var
  mpos: Integer;
Begin
  if FActive then
  begin
    if FState=dsIdle then
    Begin
      if getRecCount>0 then
      mPos:=0 else
      mpos:=-1;
      setPosition(mPos);
    end else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

Procedure TQTXDataset.Last;
var
  mpos: Integer;
Begin
  if FActive then
  begin
    if FState=dsIdle then
    Begin
      if getRecCount>0 then
      mPos:=getRecCount-1 else
      mpos:=-1;
      setPosition(mPos);
    end else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

Procedure TQTXDataset.Next;
Begin
  if FActive then
  Begin
    if FState=dsIdle then
    setPosition(TInteger.EnsureRange(FDsIndex+1,-1,getRecCount)) else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

Procedure TQTXDataset.Back;
Begin
  if FActive then
  Begin
    if FState=dsIdle then
    setPosition(TInteger.EnsureRange(FDsIndex+1,-1,getRecCount)) else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

Procedure TQTXDataset.MoveTo(const aRecNo:Integer);
Begin
  if FActive then
  Begin
    if FState=dsIdle then
    setPosition(TInteger.EnsureRange(aRecNo,0,getRecCount-1)) else
    raise EW3Dataset.Create(CNT_DATASET_INVALID_STATE);
  end else
  raise EW3Dataset.Create(CNT_DATASET_NOT_ACTIVE);
end;

Procedure TQTXDataset.DoBeforeDatasetCreated;
Begin
end;

Procedure TQTXDataset.DoAfterDatasetCreated;
Begin
  if assigned(FOnCreated) then
  Begin
    if not FDestroying then
    FOnCreated(self);
  end;
end;

Procedure TQTXDataset.DoBeforeDatasetClosed;
Begin
end;

Procedure TQTXDataset.DoAfterDatasetClosed;
Begin
  if assigned(FOnClosed) then
  Begin
    if not FDestroying then
    FOnClosed(self);
  end;
end;

function TQTXDataset.getRecCount:Integer;
Begin
  result:=FCache.Count;
end;

function TQTXDataset.getRecNo:Integer;
Begin
  if FActive then
  result:=FDsIndex else
  result:=-1;
end;

function TQTXDataset.getEOF:Boolean;
Begin
  if FActive then
  result:=FDsIndex>=getRecCount else
  result:=True;
end;

function TQTXDataset.getBOF:Boolean;
Begin
  if FActive then
  result:=FDsIndex<=0 else
  result:=True;
end;

//#############################################################################
// TQTXDatasetFields
//#############################################################################

Destructor TQTXDatasetFields.Destroy;
Begin
  Clear;
  inherited;
end;

Procedure TQTXDatasetFields.setReadOnly(const aValue:Boolean);
var
  x:  Integer;
begin
  if FFields.Length>0 then
  Begin
    for x:=FFields.Low to FFields.High do
    FFields[x].setReadOnly(aValue);
  end;
end;

Procedure TQTXDatasetFields.ResetValues;
var
  mItem:  TQTXDatasetField;
Begin
  if FFields.Length>0 then
  Begin
    for mItem in FFields do
    mItem.setValue(null);
  end;
end;

Procedure TQTXDatasetFields.Clear;
var
  x:  Integer;
Begin
  if FFields.Count>0 then
  Begin
    try
      for x:=FFields.Low to FFields.High do
      FFields[x].free;
    finally
      FFields.Clear;
    end;
  end;
end;

Procedure TQTXDatasetFields.DeleteByName(aName:String);
var
  mIndex: Integer;
Begin
  mIndex:=IndexOf(aName);
  if mIndex>=0 then
  Begin
    FFields[mIndex].free;
    FFields.Delete(mIndex,1);
  end;
end;

Procedure TQTXDatasetFields.Delete(const aIndex:Integer);
Begin
  if (aIndex>=0) and (aIndex<FFields.Count) then
  Begin
    FFields[aIndex].free;
    FFields.Delete(aIndex,1);
  end;
end;

function TQTXDatasetFields.Add(aName:String;
        const aKind:TQTXDatasetFieldType):TQTXDatasetField;
Begin
  result:=NIL;
  aName:=lowercase(trim(aName));
  if aName.Length>0 then
  Begin
    if IndexOf(aName)=-1 then
    Begin
      case aKind of
      ftBoolean:  result:=TQTXBooleanField.Create(self);
      ftInteger:  result:=TQTXIntegerField.Create(self);
      ftFloat:    result:=TQTXFloatField.Create(self);
      ftString:   result:=TQTXStringField.Create(self);
      ftDateTime: result:=TQTXDateTimeField.Create(self);
      ftAutoInc:  result:=TQTXAutoIncField.Create(self);
      ftGUID:     result:=TQTXGUIDField.Create(self);
      else        result:=NIL;
      end;

      if result<>NIL then
      Begin
        result.Name:=aName;
        FFields.add(result);
      end else
      Raise EW3DatasetField.Create(CNT_DATASET_FIELD_UNKNOWN);

    end;
  end;
end;

function TQTXDatasetFields.DataExport:TQTXDatasetPacket;
var
  mField:TQTXDatasetField;
Begin
  result:=TVariant.CreateObject;
  if FFields.count>0 then
  Begin
    for mField in FFields do
    result[mField.Name]:=mField.getValue;
  end;
end;

Procedure TQTXDatasetFields.DataImport(const aValue:TQTXDatasetPacket);
var
  mField:TQTXDatasetField;
Begin
  if FFields.count>0 then
  Begin
    for mField in FFields do
    mField.setvalue(aValue[mField.Name]);
  end;
end;

function TQTXDatasetFields.IndexOf(aName:String):Integer;
var
  x:  Integer;
Begin
  result:=-1;
  aName:=lowercase(trim(aName));
  if aName.Length>0 then
  Begin
    for x:=FFields.Low to FFIelds.High do
    Begin
      If FFIelds[x].Name=aName then
      Begin
        result:=x;
        break;
      end;
    end;
  end;
end;

function TQTXDatasetFields.FieldByName(aName:String):TQTXDatasetField;
var
  x:  Integer;
Begin
  result:=NIL;
  aName:=lowercase(trim(aName));
  if aName.Length>0 then
  Begin
    for x:=FFields.Low to FFields.High do
    Begin
      If FFields[x].Name=aName then
      Begin
        result:=FFields[x];
        break;
      end;
    end;
  end;
end;

//#############################################################################
// TQTXGUIDField
//#############################################################################

function TQTXGUIDField.getGenerated:Boolean;
Begin
  result:=true;
end;

Procedure TQTXGUIDField.Generate;
Begin
  inherited setValue(uppercase(String.createGUID));
end;

//#############################################################################
// TQTXAutoIncField
//#############################################################################

function TQTXAutoIncField.getGenerated:Boolean;
Begin
  result:=true;
end;

Procedure TQTXAutoIncField.Generate;
Begin
  inc(FCalc);
  inherited setValue(FCalc);
end;

//#############################################################################
// TQTXDateTimeField
//#############################################################################

function TQTXDateTimeField.getValue:TDateTime;
Begin
  result:=inherited getValue;
end;

procedure TQTXDateTimeField.setValue(const aValue:TDateTime);
Begin
  inherited setValue(aValue);
end;

//#############################################################################
// TQTXDatasetField
//#############################################################################

Constructor TQTXDatasetField.Create(const aParent:TQTXDatasetFields);
Begin
  inherited Create;
  FParent:=aParent;
  FKind:=ftUnknown;
  FName:='Field' + IntToStr( w3_GetUniqueNumber );
end;

Procedure TQTXDatasetField.setAsDateTime(const aValue:TDateTime);
Begin
  FValue:=aValue;
end;

function TQTXDatasetField.getAsDateTime:TDateTime;
Begin
  result:=FValue;
end;

Procedure TQTXDatasetField.Generate;
Begin
end;

function TQTXDatasetField.getGenerated:Boolean;
Begin
  result:=False;
end;

function TQTXDatasetField.getValue:Variant;
Begin
  result:=FValue;
end;

procedure TQTXDatasetField.setValue(const aValue:variant);
Begin
  FValue:=aValue;
end;

procedure TQTXDatasetField.setName(const aValue:String);
Begin
  if not FReadOnly then
  FName:=lowercase(trim(aValue)) else
  Raise EW3DatasetField.Create(CNT_DATASET_FIELD_READONLY);
end;

procedure TQTXDatasetField.setKind(const aKind:TQTXDatasetFieldType);
Begin
  if not FReadOnly then
  FKind:=aKind else
  Raise EW3DatasetField.Create(CNT_DATASET_FIELD_READONLY);
end;

Procedure TQTXDatasetField.setReadOnly(const aValue:Boolean);
Begin
  FReadOnly:=aValue;
end;

end.
