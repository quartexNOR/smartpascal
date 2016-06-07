unit formLogin;

interface

uses 
  W3System, W3Graphics, W3Components, W3Forms, W3Fonts, W3Borders,
  W3Application, W3Label, W3Editbox, W3Button, W3Panel,
  w3Image, w3time;

type
  TformLogin=class(TW3form)
    procedure W3Button1Click(Sender: TObject);
  private
    {$I 'formLogin:intf'}
    FFirst:   Boolean;
    FSky1:    TW3CustomControl;
    FSky2:    TW3CustomControl;
    Procedure UpdateCloud1;
    Procedure UpdateCloud2;
  protected
    procedure InitializeForm; override;
    procedure InitializeObject; override;
    procedure Resize; override;
  public
    Procedure ResetState;
    procedure FormActivated; override;
  end;

implementation

{ TformLogin}

uses casebook, qtxutils, qtxeffects;

Procedure TformLogin.ResetState;
begin
  FFirst:=True;
  w3Button1.enabled:=True;
  w3label2.fxFadeIn(0.5);
  w3label1.fxWarpIn(0.3);
  self.UpdateCloud1;
  self.UpdateCloud2;
end;

procedure TformLogin.W3Button1Click(Sender: TObject);
begin
    TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      FFirst:=False;
         w3label2.fxFadeOut(0.5);
         w3label1.fxWarpOut(0.3);
         w3button1.Enabled:=False;
         w3button1.fxFadeOut(0.5);

      TQTXRuntime.DelayedDispatch( procedure ()
        begin
          application.GotoForm('mainForm',feFromRight);
        end,
        600);

    end,
    100);
end;

procedure TformLogin.InitializeForm;
begin
  inherited;
  FFirst:=True;

  w3button1.StyleClass:='CaseBookButton';
  w3button1.Visible:=False;

  w3label1.styleclass:='CaseBookLogo';
  w3label1.top:=-w3label1.height;
  w3label1.AlignText:=taCenter;

  w3label2.styleClass:='Tardis';
  w3label2.top:=-w3label2.height;
  w3label2.AlignText:=taCenter;

  FSky1:=TW3CustomControl.Create(self);
  FSky1.AlphaBlend:=True;
  FSky1.Opacity:=90;
  FSky1.SendToBack;
  FSky1.Handle.style['background']:='transparent';
  FSky1.SetSize(359,127);
  FSky1.Background.FromURL('res/cloud_1.png');
  FSky1.Visible:=false;

  FSky2:=TW3CustomControl.Create(self);
  FSky2.AlphaBlend:=True;
  FSky2.Opacity:=90;
  FSky2.SendToBack;
  FSky2.Handle.style['background']:='transparent';
  FSky2.setSize(382,194);
  FSky2.Background.FromURL('res/cloud_2.png');
  FSky2.Visible:=false;

    TQTXRuntime.DelayedDispatch( procedure ()
    begin
      FSky1.left:=45;
      FSky1.Top:=100;
      FSky1.Visible:=true;
      UpdateCloud1;

      FSky2.left:=ClientWidth- 100;
      FSky2.Top:=220;
      FSky2.Visible:=true;
      UpdateCloud2;
    end,
    500);

  (* w3_callback( procedure ()
    var
      mApp: TApplication;
      x:  Integer;
    Begin
      mApp:=TApplication(application);
      for x:=0 to mApp.FormCount-1 do
      Begin
        if not (self = mApp.forms[x]) then
        begin
          mApp.Forms[x].MoveTo(100,100);
          mApp.forms[x].visible:=True;
          mapp.forms[x].InitializeForm;
          mApp.forms[x].LayoutChildren;
          mApp.forms[x].visible:=False;
        end;
      end;
    end,
    100); *)
end;

Procedure TformLogin.UpdateCloud2;
Begin
  if (Application.CurrentForm=TApplication(Application).formLogin) then
  begin
    if not FSky2.fxBusy then
    FSky2.fxMoveTo(-FSky2.width,FSky2.top,12.0,
    procedure ()
    begin
        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          FSky2.left:=clientwidth;
          FSky2.top:=FSky2.top;
          TQTXRuntime.DelayedDispatch( procedure ()
            Begin
              updateCloud2;
            end,
            200);
        end,
        100);
    end) else
    UpdateCloud2;
  end;
end;

Procedure TformLogin.UpdateCloud1;
begin
  if (Application.CurrentForm=TApplication(Application).formLogin) then
  begin
    if not FSky1.fxBusy then
    FSky1.fxMoveTo(-FSky1.width,FSky1.top,4.0,
    procedure ()
    begin
      TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          FSky1.left:=clientwidth;
          FSky1.top:=FSky1.top;
          TQTXRuntime.DelayedDispatch( procedure ()
            Begin
              updateCloud1;
            end,
            200);
        end,
        100);
    end) else
    UpdateCloud1;
  end;
end;

procedure TformLogin.FormActivated;
var
  dx,dy:  Integer;
Begin
  inherited;
  if FFirst then
  begin
    //TApplication(application).header.title.caption:='Welcome';

    TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      dy:=clientHeight div 2;
      dec(dy,24);

      w3label1.width:=240;
      dx:=(clientwidth div 2) - (w3label1.width div 2);
      w3Label1.Left:=dx;
      w3label1.fxMoveTo(dx,dy-(w3label1.height + 1),1.0);

      dx:=(clientwidth div 2) - (w3label2.width div 2);
      w3label2.left:=dx;
      w3label2.fxMoveTo(dx,dy,0.8);

      dx:=(clientwidth div 2) - (128 div 2);
      w3button1.left:=dx;
      w3button1.top:=dy;

      w3button1.MoveTo(dx,dy+40);
      w3button1.fxFadeIn(1.0);
    end,
    500);
  end else
  begin
    UpdateCloud1;
    updateCloud2;
  end;
end;

procedure TformLogin.InitializeObject;
begin
  inherited;
  {$I 'formLogin:impl'}

  w3_setStyle(Handle,'background',
  '-webkit-radial-gradient(center, circle cover, #6B87C4 0%, #506BA3 50%, #344e83 100%)');

end;
 
procedure TformLogin.Resize;
begin
  inherited;
end;
 
end.
