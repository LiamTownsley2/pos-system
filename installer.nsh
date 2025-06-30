!macro customInstall
  CreateDirectory "$PROGRAMDATA\pos-system"
  AccessControl::GrantOnFile "$PROGRAMDATA\pos-system" "Everyone" "FullAccess"
!macroend