unit wb.desktop.preferences;

interface

uses 
  System.Types,
  System.Types.Convert,

  System.Structure,
  System.Structure.JSON,

  wb.desktop.types;


const
  PREFS_WINDOW_EFFECTS_OPEN   = 'window.effects.open';
  PREFS_WINDOW_EFFECTS_CLOSE  = 'window.effects.close';
  PREFS_WINDOW_EFFECTS_MIN    = 'window.effects.minimize';
  PREFS_WINDOW_EFFECTS_MAX    = 'window.effects.maximize';
  PREFS_DESKTOP_FREATURE_DOC  = 'desktop.feature.doc';

type

  TWbPreferences = class(TJSONStructure)
  public
    constructor Create; override;
  end;

implementation

//#############################################################################
// TWbPreferences
//#############################################################################

constructor TWbPreferences.Create;
begin
  inherited;
  WriteBool(PREFS_WINDOW_EFFECTS_OPEN,   true);
  WriteBool(PREFS_WINDOW_EFFECTS_CLOSE,  true);
  WriteBool(PREFS_WINDOW_EFFECTS_MIN,    false);
  WriteBool(PREFS_WINDOW_EFFECTS_MAX,    false);
  writeBool(PREFS_DESKTOP_FREATURE_DOC,   true);
end;



end.
