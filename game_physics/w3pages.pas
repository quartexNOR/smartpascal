unit w3pages;

interface

uses 
  System.Types,
  SmartCL.System;

type

  EPages  = Class(EW3Exception);

  TCustomPages = Class(TObject)
  Private
    FIndex:     Integer;
    FTotal:     Integer;
    FPageSize:  Integer;
  Protected
    Procedure   DoSetPageSize(const Value:Integer);virtual;
    Function    DoGetPageSize:Integer;virtual;
    Function    DoGetCurrentPage:Integer;virtual;
    Function    DoGetPageCount:Integer;virtual;
    Function    DoGetIndex:Integer;virtual;
    Function    DoGetTotal:Integer;virtual;
    Procedure   DoSetIndex(const Value:Integer);
    Procedure   DoSetTotal(const Value:Integer);
    Procedure   InternalNavigate(const Value:Integer);virtual;
    Procedure   InternalSetIndex(const Value:Integer);Virtual;

    (* You can chose to make these values public, depending on your
       class. Simply derive a new class from this one and decide if you
       want users to be able to access this part of the interfaces *)
    Property    OnNavigate:TNotifyEvent;
    Property    OnChange:TNotifyEvent;
    Property    OnReset:TNotifyEvent;

    Property    Total:Integer read DoGetTotal write DoSetTotal;
    Property    Current:Integer read DoGetIndex write DoSetIndex;
    Property    PageSize:Integer read DoGetPageSize
                write DoSetPageSize;
  Public
    Function    Empty:Boolean;
    Function    BOF:Boolean;
    Function    EOF:Boolean;
    Function    Next:Boolean;
    Function    Previous:Boolean;
    Function    First:Boolean;
    Function    Last:Boolean;
    Function    GetIndexOfPage(const PageNr:Integer):Integer;
    Function    NextPage:Boolean;
    Function    PrevPage:Boolean;
    Function    LastPage:Boolean;
    Function    FirstPage:Boolean;
    Procedure   Scale(const Value:Integer);
    Procedure   Allocate(aTotal,aPageSize:Integer);virtual;
    Procedure   Release;virtual;
    Property    PageCount:Integer;
    Property    CurrentPage:Integer;
  End;

implementation

  function MakePositive(const Value:Integer):Integer;
  Begin
    If Value<0 then
    Result:=Value-1 xor -1 else
    result:=Value;
  end;

  //##########################################################################
  // TCustomPages
  //##########################################################################

  Procedure TCustomPages.Release;
  Begin
    If not Empty then
    Begin
      FPageSize:=0;
      FTotal:=-1;
      FIndex:=0;
      if assigned(OnReset) then
      OnReset(self);
    end;
  end;

  Procedure TCustomPages.InternalSetIndex(const Value:Integer);
  Begin
    If not Empty then
    Begin
      If Value < FIndex then
      InternalNavigate( -(FIndex-Value) ) else

      If Value > FIndex then
      InternalNavigate( (Value-FIndex) );
    end;
  end;

  Procedure TCustomPages.InternalNavigate(const Value:Integer);
  var
    FNewIndex:  Integer;
  Begin
    If Value<0 then
    Begin
      FNewIndex:=FIndex - MakePositive(Value);
      If FNewIndex<>FIndex then
      Begin
        FIndex:=FNewIndex;
        if assigned(OnNavigate) then
        OnNavigate(self);
      end;
    end else

    If Value>0 then
    Begin
      FNewIndex:= FIndex + Value;
      If FNewIndex<>FIndex then
      Begin
        FIndex:=FNewIndex;
        if assigned(OnNavigate) then
        OnNavigate(self);
      end;
    end;
  end;

  Procedure TCustomPages.DoSetIndex(const Value:Integer);
  Begin
    If  (Empty=False)
    and (Value<>FIndex) then
    InternalSetIndex(TInteger.EnsureRange(Value,0,FTotal-1));
  end;

  Function TCustomPages.DoGetIndex:Integer;
  Begin
    result:=FIndex;
  end;

  Function TCustomPages.DoGetTotal:Integer;
  Begin
    result:=FTotal;
  end;

  Procedure TCustomPages.Allocate(aTotal,aPageSize:Integer);
  Begin
    if not Empty then
    Release;

    if aTotal>0 then
    Begin
      if aTotal>=aPageSize then
      Begin
        FTotal:=aTotal;
        FPageSize:=TInteger.EnsureRange(aPageSize,1,aTotal);
      end else
      Raise EPages.CreateFmt
      ('Invalid pagesize [%d], size must not exceed total [%d] error',
      [aPageSize,aTotal]);
    end else
    Raise EPages.CreateFmt
    ('Invalid pager range [%d with pagesize of %d], total must exceed 0 error',
    [aTotal,aPageSize]);
  end;

  Procedure TCustomPages.DoSetTotal(const Value:Integer);
  Begin
    (* reset current *)
    If not Empty then
    Release;

    If Value>0 then
    Begin
      FTotal:=Value;
      if assigned(OnChange) then
      OnChange(self);
    end;
  end;

  Function TCustomPages.GetIndexOfPage(const PageNr:Integer):Integer;
  Begin
    If (PageNr>=0) and (PageNr<DoGetPageCount) then
    Begin
      If PageNR>0 then
      result:=(FPageSize * PageNr) -1 else
      result:=0;
    end else
    Begin
      if not Empty then
      result:=0 else
      result:=-1;
    end;
  end;

  Function TCustomPages.NextPage:Boolean;
  Begin
    result:=(Empty=False) and (FPageSize>0);
    If result then
    DoSetIndex(GetIndexOfPage(DoGetCurrentPage+1));
  end;

  Function TCustomPages.PrevPage:Boolean;
  Begin
    result:=(Empty=False) and (FPageSize>0);
    If result then
    DoSetIndex(GetIndexOfPage(DoGetCurrentPage-1));
  end;

  Function TCustomPages.LastPage:Boolean;
  Begin
    result:=(Empty=False) and (FPageSize>0);
    If result then
    DoSetIndex(GetIndexOfPage(DoGetPageCount-1));
  end;

  Function TCustomPages.FirstPage:Boolean;
  Begin
    result:=(Empty=False) and (FPageSize>0);
    If result then
    DoSetIndex(0);
  end;

  Function TCustomPages.DoGetCurrentPage:Integer;
  Begin
    if  (FTotal>0)
    and (FPageSize>0)
    and (FIndex>0) then
    Result:=FIndex+1 div FPageSize else
    result:=0;
  end;

  Function TCustomPages.DoGetPageCount:Integer;
  Begin
    if  (FTotal>0)
    and (FPageSize>0) then
    result:=FTotal+1 div FPageSize else
    result:=0;
  end;

  Function TCustomPages.DoGetPageSize:Integer;
  Begin
    result:=FPageSize;
  end;

  Procedure TCustomPages.DoSetPageSize(const Value:Integer);
  Begin
    FPageSize:=TInteger.EnsureRange(Value,0,FTotal-1)
  end;

  Function TCustomPages.Empty:Boolean;
  Begin
    Result:=FTotal<1;
  end;

  Function TCustomPages.BOF:Boolean;
  Begin
    Result:=FIndex=0;
  end;

  Function TCustomPages.EOF:Boolean;
  Begin
    result:=FIndex>FTotal-1;
  end;

  Function TCustomPages.Next:Boolean;
  Begin
    Result:=(Empty=False) and (EOF=False);
    if result then
    InternalSetIndex(FIndex + 1);
  end;

  Function TCustomPages.Previous:Boolean;
  Begin
    Result:=(Empty=False) and (BOF=False);
    if result then
    InternalSetIndex(FIndex - 1);
  end;

  Function TCustomPages.First:Boolean;
  Begin
    result:=Empty=False;
    If result then
    InternalSetIndex(0);
  end;

  Function TCustomPages.Last:Boolean;
  Begin
    result:=not Empty;
    If result then
    InternalSetIndex(FTotal-1);
  end;

  Procedure TCustomPages.Scale(const Value:Integer);
  Begin
    If not Empty then
    Begin
      If Value>0 then
      inc(FTotal,Value) else

      If Value<0 then
      Begin
        If ( FTotal-MakePositive(Value) ) < 1 then
        Release else
        Begin
          FTotal:=FTotal-MakePositive(Value);

          If FTotal<FPageSize then
          FPageSize:=FTotal-1;

          If FIndex>FTotal-1 then
          Begin
            FIndex:=FTotal;
            InternalNavigate(-1);
          end;
        end;
      end;

    end else
    If Value>0 then
    DoSetTotal(Value);
  end;


end.
