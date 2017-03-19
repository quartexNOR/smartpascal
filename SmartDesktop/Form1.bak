unit Form1;

interface

uses

  System.Colors,
  System.Types,
  System.Types.Graphics,
  System.JSON,

  SmartCL.System,
  SmartCL.Storage,
  SmartCL.Storage.Cookie,
  SmartCL.Storage.Local,
  SmartCL.Storage.Session,

  wb.uae,
  wb.Webkit,
  wb.desktop.types,
  wb.desktop.core,
  wb.desktop.devices,
  wb.desktop.window,
  wb.desktop.window.folder,
  wb.desktop.menu,
  wb.desktop.iconview,
  wb.desktop.window.prefs,
  wb.desktop.textviewer,

  System.Structure,
  System.Structure.Json,

  SmartCl.Events,
  SmartCL.Css.Classes,
  SmartCL.Css.StyleSheet,
  SmartCL.Time,
  SmartCL.Touch,
  SmartCL.Graphics,
  SmartCL.Effects,
  SmartCL.FileUtils,
  SmartCL.Components, SmartCL.Forms,
  SmartCL.Fonts, SmartCL.Borders, SmartCL.Application,

  SmartCL.Controls.Button;

type

  TCKEditor = class(TW3CustomControl)
  private
    FJsLibLoaded:  boolean;
    FObjName: string;
    procedure AttachToControl;
  protected
    procedure ObjectReady; override;
  end;

  TForm1 = class(TW3Form)
  private
    {$I 'Form1:intf'}
    FLayout:  TWbDesktop;

  protected
    procedure ObjectReady; override;
    procedure InitializeForm; override;
    procedure InitializeObject; override;
    procedure Resize; override;
  end;

implementation

{ TForm1 }

uses unit1, wb.desktop.types;

procedure TCKEditor.ObjectReady;
begin
  inherited;

  // Load script
  TW3Storage.LoadScript("lib/ckeditor/ckeditor.js", procedure (Filename: string; Success: boolean)
    begin
      // loaded? OK, attach
      FJsLibLoaded := true;
      TW3Dispatch.Execute( AttachToControl, 100);
    end);


  FObjName := TW3Identifiers.GenerateUniqueComponentName();
  FObjName := 'slobodan';

  background.fromColor(clRed);

  var txt := '<textarea id="%s" name="%s" cols="10" rows="10"  contenteditable="true">HELLO!</div>';
  InnerHTML := StrReplace(txt,'%s',FObjName);
end;

procedure TCKEditor.AttachToControl;
var
  LName:  string;
  LExists: boolean;
begin

  if not FJsLibLoaded then
  begin
    TW3Dispatch.Execute(AttachToControl, 150);
    exit;
  end;

  asm
    @LExists = (CKEDITOR);
  end;
  if not LExists then
  begin
    Writeln("CKEDITOR namespace not yet registered");
    TW3Dispatch.Execute(AttachToControl, 150);
    exit;
  end;

  LExists := false;
  asm
    @LExists = (CKEDITOR.replace);
  end;
  if not LExists then
  begin
    Writeln("CKEDITOR.replace() not yet loaded");
    TW3Dispatch.Execute(AttachToControl, 150);
    exit;
  end;

  LName := FObjName;
  try
    asm
		  CKEDITOR.replace( 'slobodan', {
			height: 260,
			contentsCss:['lib/ckeditor/contents.css', 'lib/ckeditor/skins/moono-dark/editor.css' ],
			on: {
				    'instanceReady': function (evt)
						{
						  evt.editor.execCommand('maximize');
						}
				}
		} );
    end;
  except
    on e: exception do
    showmessage(e.message);
  end;

end;

//####################################

procedure TForm1.InitializeObject;
begin
  inherited;
  {$I 'Form1:impl'}
  FLayout := TWbDesktop.Create(self);
  RegisterDesktop(FLayout as IWbDesktop);
end;


procedure TForm1.ObjectReady;
begin
  inherited;

  FLayout.OnItemSelected := procedure (Sender: TObject; const NewItem, OldItem: TWbListItem)
  var
    LAccess:  IWbDesktop;
    LCurrent: TWbCustomWindow;
  begin
    if NewItem = nil then
    begin
      LAccess := GetDesktop() as IWbDesktop;
      LCurrent := LAccess.GetActiveWindow();
      LAccess.SetFocusedWindow(NIL);

      if LCurrent <> nil then
      begin
        if LCurrent.Focused then
        LCurrent.handle.blur();
      end;

      FLayout.SetFocus();
    end;
  end;

  {var wText := TWbTextViewForm.Create(self);
  wText.Handle.ReadyExecute( procedure ()
    begin
      wText.Header.Title.Caption :='Amiga Text Reader';
      wText.SetBounds(200,80, 400, 360);
      wText.View.StyleClass := '.TWbTextView';

      TW3Dispatch.Execute( procedure ()
      begin
        var LAccess := GetDesktop();
        var LPrefs := LAccess.GetPreferencesObject();
        var LText :=  TJSONStructure(LPrefs).ToJSon();

        wText.View.Lines.add("<h3>Current settings</h3>");
        wText.View.Lines.add("" + TJSONObject.HighlightJSON(LText) + "");
        wText.View.Update();
        //wText.Invalidate();
      end, 200);
  end); }

  var wd := width div 2;
  var hd := height div 2;

  var Demo := TWbExternalWindow.Create(self);
  Demo.Handle.ReadyExecute( procedure ()
  begin
    Demo.Header.Title.Caption :='External application';
    //Demo.SetBounds(wd,10, wd, hd);
    TW3Dispatch.Execute( procedure ()
    begin
      Demo.OpenURL("http://mod.haxor.fi/mod.razor_1911", []);
    end, 200);
  end);

  var editor := TWbExternalWindow.Create(self);
  editor.Handle.ReadyExecute( procedure ()
  begin
    editor.Header.Title.Caption :='Amiga text editor';
    //editor.SetBounds(30,100, wd, hd);
    TW3Dispatch.Execute( procedure ()
    begin
      editor.OpenURL("ted.html", []);
    end, 100);
  end);

  (* var Painter := TWbExternalWindow.Create(self);
  Painter.Handle.ReadyExecute( procedure ()
  begin
    Painter.Header.Title.Caption :='APaint';
    Painter.SetBounds(440,10, 800, 550);
    TW3Dispatch.Execute( procedure ()
    begin
      Painter.OpenURL("http://nurbldoff.github.io/oldpaint/", []);
      Painter.Setfocus();


    end, 200);
  end);   *)


  TW3Dispatch.Execute( procedure ()
    begin
      FLayout.LayoutWindows();
    end,
    100);

  TW3Dispatch.Execute( procedure ()
  begin
    Demo.UnSelect();
    TW3Dispatch.Execute( procedure ()
    begin
      FLayout.SetFocus();
    end, 200);
  end, 1000);

  TW3Dispatch.Execute( procedure ()
    begin
      var LItem := TCKEditor.Create(self);
      LItem.SetBounds(200,96,400,400);
    end, 1000);

  //######################################################

  { var Win2 := TWbExternalWindow.Create(self);
  Win2.Handle.ReadyExecute( procedure ()
  begin
    Win2.Header.Title.Caption :='External application';
    Win2.SetBounds(1000,80, 400, 360);
    TW3Dispatch.Execute( procedure ()
    begin
      Win2.OpenURL("https://threejs.org/examples/#webgl_camera", []);
      Win2.Setfocus();
    end, 200);
  end);    }



end;

procedure TForm1.InitializeForm;
begin
  inherited;

  FLayout.SetBounds(20,100, 200,200);
  //FLayout.Background.FromURL('res/maxresdefault.jpg');
  FLayout.Background.FromURL('res/newbabylon.jpg');
  //FLayout.Background.FromURL('res/background_synergy.png');
  FLayout.Background.Size.Mode := smAuto;
  FLayout.handle.style.tabindex := 0;
  FLayout.OnKeyPress := procedure (Sender: TObject; aChar: string)
  begin
    writeln(aChar);
  end;

  var App := TApplication(application);

  Writeln("Mounting devices");
  for var x := 0 to App.Devices.Count-1 do
  begin

    var LDevice := App.Devices[x];

    var LItem := TWbListItemIcon.Create(FLayout);
    LItem.Text.Caption := LDevice.Name;
    LItem.Text.Font.Color := clWhite;
    LItem.Text.Container.TextShadow.Shadow(1,1,2,$000000);
    LItem.Data := LDevice;

    try
      App.Devices[x].mount( procedure (Sender: TWbStorageDevice)
        begin
          Writeln("Mounted <" + Sender.Name + '>');
        end);
    except
      on e: exception do
      writeln("****** " + e.message);
      //showmessage(e.message);
    end;

    if (App.Devices[x] is TWbStorageDeviceRamDisk) then
    begin
      LItem.Glyph.LoadFromURL('res/Ram.png');
      LItem.OnDblClick := procedure (sender: TObject)
      begin
        var LPrefs := TWbPreferences.Create(self);
        LPrefs.header.title.caption := "Preferences";
        // LPrefs.header.background.FromURL('res/window_header_unselected.png');
        LPrefs.SetBounds(100,100,420,540);
        TW3Dispatch.Execute( procedure ()
          begin
            LPrefs.Invalidate();
          end, 100);
      end;
    end else
    begin
      LItem.Glyph.LoadFromURL('res/sys_n.png');
      LItem.OnDblClick := procedure (Sender: TObject)
      begin
        var dir := TWbWindowDirectory.Create(self);
        dir.Header.Title.Caption :='Examining ' + LDevice.Name;
        dir.SetBounds(LItem.left + LItem.width,LItem.top + LItem.Height,400,340);
        TW3Dispatch.Execute( procedure ()
          begin
            dir.BrowseTo(LDevice,'');
            dir.Invalidate();
          end, 100);
      end;
    end;
  end;


  //######################################################

  self.OnContextPopup := procedure (sender: TObject; const mousePos: TPoint; var handled: boolean)
  begin
    Handled := true;
  end;

  FLayout.invalidate;

  (* TW3Dispatch.Execute( procedure ()
    begin
      LoadUAECore();
      LoadWebKitEngine();
    end, 200); *)

end;

procedure TForm1.Resize;
begin
  inherited;
  FLayout.SetBounds(0,0,ClientWidth,ClientHeight);
end;
 
initialization
 Forms.RegisterForm({$I %FILE%}, TForm1);

end.
