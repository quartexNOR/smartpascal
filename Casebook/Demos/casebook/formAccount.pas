unit formAccount;

interface

uses 
  W3System, W3Graphics, W3Components, W3Forms, W3Fonts,
  W3Borders, W3Application, w3label;

type
  TformAccount=class(TW3form)
  private
    {$I 'formAccount:intf'}
  protected
    procedure InitializeForm; override;
    procedure InitializeObject; override;
    procedure Resize; override;
  public
    procedure FormActivated; override;
  end;

implementation

uses casebook, qtxeffects, qtxutils;
{ TformAccount}

procedure TformAccount.FormActivated;
Begin
  inherited;
  TApplication(application).Header.Title.Caption:='Profile <i class="fa fa-angle-double-right"></i> Account';
  TApplication(application).Header.BackButton.Visible:=True;
  TApplication(application).Header.BackButton.OnClick:=Procedure (sender:TObject)
    Begin
      application.GotoForm("FormProfile",feToLeft);
    end;
end;

procedure TformAccount.InitializeForm;
begin
  inherited;
  // this is a good place to initialize components
end;

procedure TformAccount.InitializeObject;
begin
  inherited;
  {$I 'formAccount:impl'}
end;
 
procedure TformAccount.Resize;
begin
  inherited;
end;
 
end.
