unit wb.desktop.types;

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

  SmartCL.Components,
  SmartCL.Storage,
  SmartCL.Storage.Cookie,
  SmartCL.Storage.Local,
  SmartCL.Storage.Session
  ;


const
  CNT_STYLE_Background            = $CFCFCF;
  CNT_STYLE_BACKGROUND_BRIGHT     = $EEEAE6;

  CNT_STYLE_WINDOW_FRAME_DARK     = $19234D;
  CNT_STYLE_WINDOW_FRAME_LIGHT    = $92BFFF;

  CNT_STYLE_WINDOW_BASE_SELECTED   = $618ECE;
  CNT_STYLE_WINDOW_BASE_UNSELECTED = $CFCFCF;

  CNT_STYLE_EDGE_LIGHT    = $F7F7F7;
  CNT_STYLE_EDGE_DARK     = $626262;
  CNT_STYLE_EDGE_DARKEST  = $3C3C3C;

type

  TWbCustomControl = class(TW3CustomControl)
  end;

  TWbWindowElement = class(TWbCustomControl)
  end;

  TWbWindowGlyph = class(TWbWindowElement)
  end;

  TWbCustomWindow = partial class(TWbCustomControl)
  end;

  TWbWindowList = array of TWbCustomWindow;

  IWbDesktop = interface
    ['{2B00D011-4A26-4ADF-A128-651148A2E20F}']
    procedure SetFocusedWindow(const Window: TWbCustomWindow);
    function  IsDesktop(const Control:TW3CustomControl): boolean;
    function  FindWindowFor(const Control: TWbCustomControl): TWbCustomWindow;
    function  GetActiveWindow: TWbCustomWindow;
    function  GetWindowList: TWbWindowList;
    procedure RegisterWindow(const Window: TWbCustomWindow);
    procedure UnRegisterWindow(const Window: TWbCustomWindow);
    function  GetPreferencesObject: TW3Structure;
    function  KnownWindow(const Window: TWbCustomWindow): boolean;
    procedure SavePreferences;
  end;

  procedure RegisterDesktop(const Desktop: IWbDesktop);
  function  GetDesktop: IWbDesktop;

const
  PREFS_WINDOW_EFFECTS_OPEN   = 'window.effects.open';
  PREFS_WINDOW_EFFECTS_CLOSE  = 'window.effects.close';
  PREFS_WINDOW_EFFECTS_MIN    = 'window.effects.minimize';
  PREFS_WINDOW_EFFECTS_MAX    = 'window.effects.maximize';

implementation

uses Wb.Desktop.Window;

var
LDesktop: IWbDesktop;

procedure RegisterDesktop(const Desktop: IWbDesktop);
begin
  LDesktop := Desktop;
end;

function  GetDesktop: IWbDesktop;
begin
  result := LDesktop;
end;

//#############################################################################
// TWbCustomControl
//#############################################################################


end.
