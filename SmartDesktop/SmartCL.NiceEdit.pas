unit SmartCL.NiceEdit;

interface

uses 
  System.Types,
  System.Types.Graphics,
  System.Time,
  System.Colors,
  System.Types.Convert,

  SmartCL.ControlWrapper,
  SmartCL.System,
  SmartCl.Events,
  SmartCL.Css.Classes,
  SmartCL.Css.StyleSheet,
  SmartCL.Components,
  SmartCL.Controls.Elements,
  SmartCl.Controls.Scrollbar,
  SmartCL.Fonts, SmartCL.Borders;

type

  TW3NiceEdit = class(TW3CustomControl)
  private
    FInstance: THandle;
    FChild:   TW3DIVHtmlElement;
    FHScroll: TW3HorizontalScrollbar;
    FVScroll: TW3VerticalScrollbar;
  protected
    procedure SetEnabled(const EnabledValue: boolean); override;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  Content: TW3DIVHtmlElement read FChild;
    procedure ActivateEditor;
    procedure DeactivateEditor;
  end;

  TW3NiceEditEngineCallback = procedure (Success: boolean);

  TW3NiceEditEngine = class static
  private
    class var FInternal: boolean = false;
    class var FInitialized: boolean = false;
    class var FScriptObj: THandle;
  public
    class property  InternalError: boolean read FInternal;
    class property  Active: boolean read FInitialized;
    class procedure SetupLibrary(const CB: TW3NiceEditEngineCallback);
    class procedure ShutdownLibrary(const CB: TW3NiceEditEngineCallback);
  end;



implementation

uses
  SmartCL.FileUtils;

{$R "nicEdit.js"}

//#############################################################################
// TW3NiceEdit
//#############################################################################

procedure TW3NiceEdit.InitializeObject;
begin
  inherited;
  FChild := TW3DIVHtmlElement.Create(self);
  FHScroll := TW3HorizontalScrollbar.Create(self);
  FVScroll := TW3VerticalScrollbar.Create(self);
end;

procedure TW3NiceEdit.FinalizeObject;
begin
  DeactivateEditor();
  FChild.free;
  FHScroll.free;
  FVScroll.free;
  inherited;
end;

procedure TW3NiceEdit.ObjectReady;
begin
  inherited;
  FChild.handle.style.width := "100%";
  FChild.handle.style.height := "100%";
  ActivateEditor();
end;

procedure TW3NiceEdit.SetEnabled(const EnabledValue: boolean);
begin
  inherited SetEnabled(EnabledValue);
  FHScroll.Enabled := EnabledValue;
  FVScroll.Enabled := EnabledValue;

  if not EnabledValue then
    FChild.Background.FromColor(clNone)
  else
    FChild.Background.FromColor(clWhite);
end;

procedure TW3NiceEdit.ActivateEditor;
var
  LObj:  THandle;
  LName: string;
begin

  /* Load editor on demand */
  if not TW3NiceEditEngine.Active then
  begin
    Enabled := false;
    Cursor := crWait;
    TW3NiceEditEngine.SetupLibrary( procedure (Success: boolean)
    begin
      if Success then
      begin
        TW3Dispatch.Execute( procedure ()
        begin
          ActivateEditor();
          Cursor := crDefault;
          Enabled := true;
        end, 100);
      end else
      exit;
    end);
    exit;
  end;

  if not FInstance.valid then
  begin
    LName := FChild.TagId;

    asm
      @LObj = new nicEditor({fullPanel : true}).panelInstance(@LName);
    end;
    FInstance := LObj;

    FChild.innerHTML :='<b>This is a test</b><br>Of NiceEdit which is very cool';

    TW3Dispatch.Execute( procedure ()
    begin
      Invalidate;
    end, 100);
  end;
end;

procedure TW3NiceEdit.DeactivateEditor;
var
  LId:  string;
begin
  if FInstance.valid then
  begin
    LId := FChild.TagId;
    asm
      @FInstance = (@FInstance).removeInstance(@LId);
    end;
    FInstance := null;
  end;
end;

procedure TW3NiceEdit.Resize;
var
  LheadTop: integer;
  dx, dy: integer;
begin
  inherited;
  if FInstance.valid then
  begin
    LheadTop := 48;
    var LWrapper := TW3HtmlElement.Create(self.Handle);
    if LWrapper.Children.length >1 then
    begin
      LWrapper := LWrapper.Wrap( LWrapper.Children.items[0] );
      LWrapper.Handle.style.width := "100%";
      LheadTop := LWrapper.clientHeight;
    end;

    FChild.SetBounds(1,LheadTop,(clientwidth-CNT_SCROLLBAR_SIZE)-2, ((clientheight-LheadTop) - CNT_SCROLLBAR_SIZE)-1);
  end;

  if assigned(FHScroll) then
  begin
    dy := clientHeight - CNT_SCROLLBAR_SIZE;
    FHScroll.SetBounds(0,dy, clientwidth - CNT_SCROLLBAR_SIZE, CNT_SCROLLBAR_SIZE);
  end;

  if assigned(FVScroll) then
  begin
    dx := clientwidth - CNT_SCROLLBAR_SIZE;
    FVScroll.SetBounds(dx,LheadTop,CNT_SCROLLBAR_SIZE, (clientheight - LheadTop)-CNT_SCROLLBAR_SIZE);
  end;

end;

//#############################################################################
// TW3NiceEditEngine
//#############################################################################

class procedure TW3NiceEditEngine.SetupLibrary(const CB: TW3NiceEditEngineCallback);
begin
  if not FInitialized then
  begin

    TW3Storage.LoadImage('/res/nicEditorIcons.gif');

    TW3Storage.LoadScript('/lib/nicEdit.js', procedure (Filename: string; ScriptObj: THandle; Success: boolean)
      begin
        FInitialized := Success;
        if Success then
          FScriptObj := ScriptObj
        else
          FInternal := true;

        if assigned(CB) then
        begin
          CB(Success);
        end;
      end);

  end else
  begin
    if assigned(CB) then
    CB(true);
  end;
end;

class procedure TW3NiceEditEngine.ShutdownLibrary(const CB: TW3NiceEditEngineCallback);
begin
  if FInitialized then
  begin

    // Kill the script object
    try
      if FScriptObj.Valid then
      begin
        try
          var LElement := FScriptObj;
          asm
            (@LElement).parentNode.removeChild(@LElement);
          end;
        finally
          FScriptObj := nil;
        end;
      end;
    finally
      FInitialized := false;
      if assigned(CB) then
        CB(true);
    end;

  end;
end;

initialization
begin
//TW3NiceEditEngine.SetupLibrary(nil);
end;

end.
