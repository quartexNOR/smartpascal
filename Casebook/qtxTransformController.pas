unit qtxTransformController;


//#############################################################################
//
//  Unit:       qtxTransformController.pas
//  Author:     Jon Lennart Aasenden [cipher diaz of quartex]
//  Copyright:  Jon Lennart Aasenden, all rights reserved
//
//  Description:
//  ============
//  This unit contains a controller to manage a HTML element (control)
//  using CSS3 GPU powered effects.
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
  System.Types, SmartCL.System, SmartCL.Components, SmartCL.Effects,
  SmartCL.graphics,
  w3c.dom,
  qtxutils;

type

  TQTXTransformOptions = set of
    (
    toUsePos,
    toUseRotX,
    toUseRotY,
    toUseRotZ,
    toUseScale
    );

  TQTXTransformController = Class(TObject)
  private
    FHandle:  THandle;
    FX:       Float;
    FY:       Float;
    FZ:       Float;
    FRotX:    Float;
    FRotY:    Float;
    FRotZ:    Float;
    FRegX:    Float;
    FRegY:    Float;
    FRegZ:    Float;
    FScaleX:  Float;
    FScaleY:  Float;
    FScaleZ:  Float;
    FFlags:   TQTXTransformOptions;
  public
    Property    Handle:THandle read FHandle;
    property    RotationX: Float read FRotX write FRotX;
    property    RotationY: Float read FRotY write FRotY;
    property    RotationZ: Float read FRotZ write FRotZ;
    property    ScaleX: Float read FScaleX write FScaleX;
    property    ScaleY: Float read FScaleY write FScaleY;
    property    ScaleZ: Float read FScaleZ write FScaleZ;
    property    RegX: Float read FRegX write FRegX;
    property    RegY: Float read FRegY write FRegY;
    property    RegZ: Float read FRegZ write FRegZ;
    property    X: Float read FX write FX;
    property    Y: Float read FY write FY;
    property    Z: Float read FZ write FZ;

    procedure   SetRegistrationPoint(const X, Y, Z: Float);
    procedure   SetTransformOrigin(const X, Y: Float);
    procedure   Scale(const X, Y, Z: Float); overload;
    procedure   Scale(const aValue: Float); overload;
    procedure   RotateX(const aValue: Float);
    procedure   RotateY(const aValue: Float);
    procedure   RotateZ(const aValue: Float);
    procedure   Rotate(const XFactor, YFactor, ZFactor: Float); overload;
    procedure   Rotate(const aValue: Float); overload;
    procedure   SetRotation(const X, Y, Z: Float);
    procedure   SetPosition(const X, Y, Z: Float);
    procedure   MoveX(const aValue: Float);
    procedure   MoveY(const aValue: Float);
    procedure   MoveZ(const aValue: Float);
    procedure   Move(X, Y, Z: Float);
    procedure   SetTransformFlags(const aValue:TQTXTransformOptions);
    procedure   Update; virtual;
    Constructor Create(const aHandle:THandle);
  End;

implementation

//############################################################################
// TQTXTransformController
//############################################################################

Constructor TQTXTransformController.Create(const aHandle:THandle);
Begin
  inherited Create;

  FScaleX := 1.0;
  FScaleY := 1.0;
  FScaleZ := 1.0;

  FFlags:=[toUsePos,toUseRotX,toUseRotY,toUseRotZ,toUseScale];

  if (aHandle) then
  begin
    FHandle:=aHandle;

    FHandle.style[w3_CSSPrefix('transformStyle')] := 'preserve-3d';
    FHandle.style[w3_CSSPrefix('Perspective')] := 800;
    FHandle.style[w3_CSSPrefix('transformOrigin')] := '50% 50%';
    FHandle.style[w3_CSSPrefix('Transform')] := 'translateZ(0px)';

    Update;
  end else
  Raise EW3Exception.Create('Invalid control handle error');
end;

procedure TQTXTransformController.MoveX(const aValue: Float);
begin
  FX+=aValue;
end;

procedure TQTXTransformController.MoveY(const aValue: Float);
begin
  FY+=aValue;
end;

procedure TQTXTransformController.MoveZ(const aValue: Float);
begin
  FZ+=aValue;
end;

procedure TQTXTransformController.Move(x, y, z: Float);
begin
  FX+=X;
  FY+=Y;
  FZ+=Z;
end;

procedure TQTXTransformController.SetRegistrationPoint(const X,Y,Z: Float);
begin
  FRegX := X;
  FRegY := Y;
  FRegZ := Z;
end;

procedure TQTXTransformController.Scale(const X,Y,Z: Float);
begin
  FScaleX := X;
  FScaleY := Y;
  FScaleZ := Z;
end;

procedure TQTXTransformController.Scale(const aValue: Float);
begin
  FScaleX := aValue;
  FScaleY := aValue;
  FScaleZ := aValue;
end;

procedure TQTXTransformController.SetPosition(const X,Y,Z: Float);
begin
  FX := X;
  FY := Y;
  FZ := Z;
end;

procedure TQTXTransformController.SetRotation(const X,Y,Z: Float);
begin
  FRotX := X;
  FRotY := Y;
  FRotZ := Z;
end;

procedure TQTXTransformController.Rotate(const XFactor,YFactor,ZFactor: Float);
begin
  FRotX+=XFactor;
  FRotY+=YFactor;
  FRotZ+=ZFactor;
end;

procedure TQTXTransformController.Rotate(const aValue: Float);
begin
  FRotX+=aValue;
  FRotY+=aValue;
  FRotZ+=aValue;
end;

procedure TQTXTransformController.RotateX(const aValue: Float);
begin
  FRotX+=aValue;
end;

procedure TQTXTransformController.RotateY(const aValue: Float);
begin
  FRotY+=aValue;
end;

procedure TQTXTransformController.RotateZ(const aValue: Float);
begin
  FRotZ+=aValue;
end;

procedure TQTXTransformController.SetTransformOrigin(const X, Y: Float);
begin
  FHandle.style[w3_CSSPrefix('transformOrigin')]  :=
  FloatToStr(X) +'px ' + FloatToStr(Y) +'px';
end;

procedure TQTXTransformController.setTransformFlags(const aValue:TQTXTransformOptions);
begin
  FFlags := aValue;
end;

procedure TQTXTransformController.Update;
var
  mTemp:  String;
begin
  if (FHandle) then
  begin
    if (toUsePos in FFlags) then
    mTemp := 'translate3d('
      + FloatToStr(FX - FRegX) + 'px,'
      + FloatToStr(FY - FRegY) + 'px,'
      + FloatToStr(FZ - FRegZ) + 'px) ';

    if (toUseRotX in FFlags) then
    mTemp := mTemp + 'rotateX(' + FloatToStr(FRotX) + 'deg) ';

    if (toUseRotY in FFlags) then
    mTemp := mTemp + 'rotateY(' + FloatToStr(FRotY) + 'deg) ';

    if (toUseRotZ in FFlags) then
    mTemp := mTemp + 'rotateZ(' + FloatToStr(FRotZ) + 'deg) ';

    if (toUseScale in FFlags) then
    mTemp := mTemp + 'scale3d(' + FloatToStr(FScaleX) + ','
      + FloatToStr(FScaleY) +','
      + FloatToStr(FScaleZ) + ') ';

    FHandle.style[w3_CSSPrefix('Transform')] := mTemp;
  end;
end;

end.
