# Създаваме директориите
New-Item -ItemType Directory -Force -Path "wwwroot/lib/flatpickr/l10n"

# Изтегляме CSS файловете
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" -OutFile "wwwroot/lib/flatpickr/flatpickr.min.css"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/material_blue.css" -OutFile "wwwroot/lib/flatpickr/themes/material_blue.css"

# Изтегляме JavaScript файловете
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js" -OutFile "wwwroot/lib/flatpickr/flatpickr.min.js"
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/bg.js" -OutFile "wwwroot/lib/flatpickr/l10n/bg.js"

Write-Host "Flatpickr файловете са изтеглени успешно!" 