unit wb.desktop.window.folder;

interface

uses
  W3C.DOM,
  System.Types,
  System.Types.Convert,
  System.Types.Graphics,
  System.Colors,
  System.Time,

  System.Streams,
  System.Reader, System.Stream.Reader,
  System.Writer, System.Stream.Writer,

  System.Structure,
  System.Structure.Json,

  System.Memory,
  System.Memory.Allocation,
  System.Memory.Buffer,

  System.Widget,

  wb.desktop.filesystem,
  wb.desktop.types,
  wb.desktop.window,
  wb.desktop.iconView,
  wb.desktop.devices,
  wb.desktop.datatypes,
  wb.desktop.window.textview,
  wb.desktop.window.editor,

  SmartCL.Time,
  SmartCL.System,
  SmartCL.MouseCapture,
  SmartCL.MouseTouch,
  SmartCL.Layout,
  SmartCL.Controls.Elements,
  SmartCL.Graphics, SmartCL.Components,
  SmartCL.Effects, SmartCL.Fonts, SmartCL.Borders,
  SmartCL.CSS.Classes, SmartCL.CSS.StyleSheet,

  SmartCL.Controls.Image, SmartCL.Controls.Label,
  SmartCL.Controls.Editbox,
  SmartCL.Controls.Panel, SmartCL.Controls.Button,
  SmartCL.Controls.Toolbar;

type

  TWbPathPanel = class(TW3Panel)
  private
    FSelect:  TW3Button;
    FEdit:    TW3Editbox;
    FLayout:  TLayout;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  SelectFolder: TW3Button read FSelect;
    property  Edit: TW3EditBox read FEdit;
  end;

  TWbWindowDirectory = class(TWbWindow)
  private
    FView:        TWbIconView;
    FToolBar:     TW3Toolbar;
    FPath:        TWbPathPanel;
    FPanel:       TW3Panel;
    FCurrentPath: string;
    FUpdateTimer: TW3Timer;

    FBtnBack:     TW3ToolbarButton;
    FBtnCut:      TW3ToolbarButton;
    FBtnCopy:     TW3ToolbarButton;
    FBtnPaste:    TW3ToolbarButton;
    procedure UpdateButtonStates(Sender: TObject);

  protected
    procedure HandleDirectoryAvailable(const Path: string; DirList: TStrArray);
    procedure HandleFolderSelect(Sender: TObject);
    procedure HandleFolderUnSelected(Sender: TObject);
    procedure HandleFileSelect(Sender: TObject);
    procedure HandleFileUnSelected(Sender: TObject);
    procedure HandleFolderDblClick(Sender: TObject);
    procedure HandleFileDblClick(Sender: TObject);
    procedure SetCurrentPath(DevicePath: string);
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  Path: TWbPathPanel read FPath;
    property  Device: TWbStorageDevice;
    procedure BrowseTo(DevicePath: string);
  end;


implementation

//#############################################################################
// TWbWindowContent
//#############################################################################

procedure TWbWindowDirectory.InitializeObject;
begin
  inherited;
  // We want the window to be sizable, and we want scrollbars
  self.SetOptions([woSizeable, woHScroll, woVScroll]);

  FPanel := TW3Panel.Create(Content);
  FToolbar := TW3Toolbar.Create(FPanel);
  FPath := TWbPathPanel.Create(FPanel);

  //FEffectName := TSuperStyle.AnimGlow(clWhite, RGBToColor($FD,$E4,$80));
  //FEffectName2 := TSuperStyle.AnimGlow(clWhite, RGBToColor($61,$8E,$CE));

  FView := TWbIconView.Create(Content);
  FView.OnItemSelected := procedure (Sender: TObject; const NewItem, OldItem: TWbListItem)
    begin
      if OldItem <> nil then
      begin
        //TWbListItemIcon(OldItem).TagStyle.RemoveByName(FEffectName2);
      end;

      if NewItem <> nil then
      begin
        //TWbListItemIcon(NewItem).TagStyle.Add(FEffectName2);
      end;
    end;

  FUpdateTimer := TW3Timer.Create(nil);
  FUpdateTimer.Delay := 200;
  FUpdateTimer.OnTime := UpdateButtonStates;
  FUpdateTimer.Enabled := true;
end;

procedure TWbWindowDirectory.FinalizeObject;
begin
  FUpdateTimer.Enabled := false;
  FUpdateTimer.OnTime := nil;
  FUpdateTimer.free;

  FView.free;
  FToolbar.free;
  FPath.free;
  inherited;
end;

procedure TWbWindowDirectory.UpdateButtonStates(Sender: TObject);
begin
  if not (csDestroying in ComponentState) then
  begin
    if (csReady in ComponentState) then
    begin
      // Update state for back [parent] button
      FBtnBack.Enabled := not (FCurrentPath.trim() in ['', '~/']);

      // Update state for Cut button
      FBtnCut.Enabled := FView.SelectedItem <> nil;

      // Update state for Copy button
      FBtnCopy.Enabled := FView.SelectedItem <> nil;

      //FBtnCopy.Enabled := false;
      FBtnPaste.Enabled := false;

    end;
  end;
end;

procedure TWbWindowDirectory.ObjectReady;
begin
  inherited;
  FToolbar.ButtonWidth := 80;
  FToolbar.ButtonHeight := 32;
  FToolbar.ButtonSpace := 4;

  FBtnBack := FToolbar.Add();
  FBtnBack.Caption := "Parent";
  FBtnBack.Layout := blIconLeft;
  FBtnBack.Glyph.LoadFromURL('res/parent.png');
  FBtnBack.OnClick := procedure (Sender: TObject)
    begin
      (Device as IWbFileSystem).CdUp( procedure (const Path: string; const Value: variant)
      begin
        //showmessage("CDUP -> " + Path);
        // callback returns boolean as second param
        if value = true then
        begin
          BrowseTo(Path);
        end;
      end);
    end;

  FBtnCut := FToolbar.Add();
  FBtnCut.Layout := blIconLeft;
  FBtnCut.Glyph.LoadFromURL('res/cut.png');
  FBtnCut.Caption := "Cut";

  FBtnCopy := FToolbar.Add();
  FBtnCopy.Layout := blIconLeft;
  FBtnCopy.Glyph.LoadFromURL('res/copy.png');
  FBtnCopy.Caption := "Copy";

  FBtnPaste := FToolbar.Add();
  FBtnPaste.Layout := blIconLeft;
  FBtnPaste.Glyph.LoadFromURL('res/paste.png');
  FBtnPaste.Caption := "Paste";

  TW3Dispatch.Execute(Invalidate, 100);
end;

procedure TWbWindowDirectory.HandleFolderSelect(Sender: TObject);
var
  LDesktop:     IWbDesktop;
  LDatatypes:   IWbDatatypeRegistry;
  LFolderInfo:  TWbDatatypeIconInfo;
begin
  LDesktop    := GetDesktop as IWbDesktop;
  LDataTypes  := LDesktop.GetDatatypes();
  LFolderInfo := TWbDatatypeIconInfo( LDataTypes.GetInfoByType('folder') );
  TWbListItemIcon(Sender).Background.FromURL(LFolderInfo.SelectedIcon);
  //TWbListItemIcon(Sender).Glyph.Background.FromURL(LFolderInfo.SelectedIcon);
end;

procedure TWbWindowDirectory.HandleFolderUnSelected(Sender: TObject);
var
  LDesktop:     IWbDesktop;
  LDatatypes:   IWbDatatypeRegistry;
  LFolderInfo:  TWbDatatypeIconInfo;
begin
  LDesktop    := GetDesktop as IWbDesktop;
  LDataTypes  := LDesktop.GetDatatypes();
  LFolderInfo := TWbDatatypeIconInfo( LDataTypes.GetInfoByType('folder') );
  TWbListItemIcon(Sender).Background.FromURL(LFolderInfo.UnSelectedIcon);
  //TWbListItemIcon(Sender).Glyph.Background.FromURL(LFolderInfo.UnSelectedIcon);
end;

procedure TWbWindowDirectory.HandleFileSelect(Sender: TObject);
begin
  TWbListItemIcon(Sender).Background.FromURL('res/HTMSel.png');
  //TWbListItemIcon(Sender).Glyph.Background.FromURL('res/HTMSel.png');
end;

procedure TWbWindowDirectory.HandleFileUnSelected(Sender: TObject);
begin
  TWbListItemIcon(Sender).Background.FromURL('res/HTM.png');
  //TWbListItemIcon(Sender).Glyph.Background.FromURL('res/HTM.png');
end;

procedure TWbWindowDirectory.HandleFolderDblClick(Sender: TObject);
var
  LNewPath: string;
  LFileName: string;
  LPath:  string;
begin
  LPath := TWbListItemIcon(Sender).Data;

  FView.Clear();

  LFileName := TWbListItemIcon(Sender).Text.Caption.trim();

  if not LPath.EndsWith('/') then
  LNewPath := LPath + '/' + LFileName else
  LNewPath := LPath + LFileName;
  BrowseTo(LNewPath);
end;

procedure TWbWindowDirectory.HandleFileDblClick(Sender: TObject);
var
  LNewPath: string;
  LFileName: string;
  LPath:  string;
  LFileSystem: IWbFileSystem;
begin
  LPath := TWbListItemIcon(Sender).Data;
  LFileName := TWbListItemIcon(Sender).Text.Caption.trim();

  if not LPath.EndsWith('/') then
  LNewPath := LPath + '/' + LFileName else
  LNewPath := LPath + LFileName;

  var LExt := TW3VirtualFileSystemPath.ExtractFileExt(LNewPath).ToLower();
  if  (LExt = '.txt')
  or  (LFileName.ToLower() = 'startup-sequence')
  or  (LFileName.ToLower() = 'user-startup') then
  begin
    //var LWindow := TWbTextViewForm.Create(self.Parent);
    var LWindow := TWbEditWindow.Create(Self.Parent);
    LWindow.SetBounds(10,100, 400, 400);
    LWindow.Header.Title.Caption := LNewPath;

    TW3Dispatch.Execute( procedure ()
    begin
      LFileSystem := Device as IWbFileSystem;
      LFileSystem.Load(LNewPath, procedure (const Path: string; const Value: variant)
      begin
        LWIndow.Editor.Content.InnerHTML := Value;
      end);
    end, 1000);

  end;
end;

procedure TWbWindowDirectory.HandleDirectoryAvailable
          (const Path: string; DirList: TStrArray);
var
  x:            integer;
  LText:        string;
  LItem:        TWbListItemIcon;
  LDesktop:     IWbDesktop;
  LDatatypes:   IWbDatatypeRegistry;
  LFolderInfo:  TWbDatatypeIconInfo;
  LFileInfo:    TWbDatatypeFile;
begin
  try
    /* Cache up datatype and icon-info for FOLDER */
    LDesktop    := GetDesktop as IWbDesktop;
    LDataTypes  := LDesktop.GetDatatypes();
    LFolderInfo := TWbDatatypeIconInfo( LDataTypes.GetInfoByType('folder') );
    LFileInfo   := TWbDatatypeFile( LDataTypes.GetInfoByType('file') );

    if DirList.length < 1 then
    exit;

    for x:=0 to Dirlist.Count-1 do
    begin
      LItem := TWbListItemIcon.Create(FView);

      if DirList[x].StartsWith('[d]') then
      begin
        LItem.TagValue := 2;
        LText := Copy(Dirlist[x],4,100);
        LItem.Text.Caption := LText;
        LItem.Text.AlignText := TTextAlign.taLeft;
        LItem.Text.Invalidate;
        LItem.Text.Font.Color := CNT_STYLE_WINDOW_BASE_SELECTED;
        LItem.Background.FromURL( LFolderInfo.UnSelectedIcon );
        //LItem.Glyph.Background.FromURL( LFolderInfo.UnSelectedIcon );
        LItem.Data := Path;
        LItem.OnDblClick := HandleFolderDblClick;
        LItem.OnSelected := HandleFolderSelect;
        LItem.OnUnSelected := HandleFolderUnSelected;

      end else
      begin
        LItem.TagValue := 1;
        LText := Copy(Dirlist[x],4,100);
        LItem.Text.Caption := LText;
        LItem.Text.AlignText := TTextAlign.taLeft;
        LItem.Text.Font.Color := clBlack;
        LItem.Text.Invalidate;
        LItem.Data := Path;
        LItem.Background.FromURL( 'res/HTM.png' );
        //LItem.Glyph.Background.FromURL('res/HTM.png');
        LItem.OnDblClick := HandleFileDblClick;
        LItem.OnSelected := HandleFileSelect;
        LItem.OnUnSelected := HandleFileUnSelected;
      end;
    end;

  finally
    self.Cursor := crDefault;
    FView.enabled := true;
    FView.Invalidate();
    FView.SetFocus();
  end;
end;

procedure TWbWindowDirectory.SetCurrentPath(DevicePath: string);
begin
  DevicePath := DevicePath.trim();
  if DevicePath <> FCurrentPath then
  begin
    FCurrentPath := DevicePath;

    // Set window title
    if (DevicePath in ['/', '']) then
    Header.Title.Caption := 'Examining ' + Device.Name else
    Header.Title.Caption := 'Examining ' + Device.Name + ' [' + FCurrentPath + ']';

    // Set path in panel
    FPath.Edit.Text := FCurrentPath;
  end;
end;

procedure TWbWindowDirectory.BrowseTo(DevicePath: string);
begin
  // Device assigned?
  if Device = nil then
  begin
    showmessage("No device available, examination of <" + DevicePath +"> failed error");
    exit;
  end;

  // device mounted?
  if not Device.mounted then
  begin
    Showmessage("Device is not mounted, examination of <" + DevicePath +"> failed error");
    exit;
  end;

  // clean
  DevicePath := DevicePath.trim();

  writeln("Browsing to path: " + DevicePath);

  // Clear current view and set new path
  FView.Clear();
  SetCurrentPath(DevicePath);

  // Shift window in "wait" mode
  Cursor := TCursor.crProgress;
  FView.enabled := false;

  // Change the device path
  (Device as IWbFileSystem).ChDir(DevicePath, procedure (const Path: string; const Value: variant)
  begin
    writeln("chdir " + Path);
    if Value = true then
    begin
      // Getting device directory
      TW3Dispatch.Execute( procedure ()
      begin
        (Device as IWbFileSystem).Dir(Path, HandleDirectoryAvailable);
      end, 200);
    end else
    begin
      writeln("Call to chdir(" + DevicePath + ") failed error");
      Cursor := TCursor.crDefault;
      FView.enabled := true;
    end;
  end);
end;

procedure TWbWindowDirectory.Resize;
var
  wd,hd: integer;
  dy: integer;
begin
  inherited;
  wd := content.clientwidth;
  hd := content.clientheight;

  FPanel.SetBounds(0,0, wd, 76);
  dy := FPanel.top + FPanel.Height;

  FView.SetBounds(0, dy, wd, hd);

  FToolbar.SetBounds(0,0,wd, FToolbar.ButtonHeight + 8);

  dy := FToolbar.top + FToolbar.height;
  wd := FPanel.Clientwidth;
  hd := FPanel.clientheight - dy;

  FPath.SetBounds(0, dy, wd, hd);
end;

//#############################################################################
// TWbPathPanel
//#############################################################################

procedure TWbPathPanel.InitializeObject;
begin
  inherited;
  FSelect := TW3Button.Create(self);
  FSelect.Font.Color := clBlack;
  FEdit := TW3Editbox.Create(self);
end;

procedure TWbPathPanel.FinalizeObject;
begin
  FEdit.free;
  FSelect.free;
  inherited;
end;

procedure TWbPathPanel.ObjectReady;
begin
  inherited;
  FSelect.caption := 'Set Destination';
  FSelect.SetSize(130 ,28);

  FEdit.SetSize(200, 26);

  FLayout := Layout.client(Layout.Margins(4).Spacing(4),
    [
      Layout.left([FSelect]),
      Layout.Client(Layout.Stretch,[FEdit])
    ]
    );
end;

procedure TWbPathPanel.Resize;
begin
  inherited;
  if assigned(FLayout) then
    FLayout.Resize(self);
end;

end.
