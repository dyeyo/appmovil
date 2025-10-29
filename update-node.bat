@echo off
echo =====================================
echo  ACTUALIZAR NODE.JS CON NVM-WINDOWS
echo =====================================

REM Verificar que nvm está instalado
nvm version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] No se encontro NVM en tu sistema.
    echo Descargalo de: https://github.com/coreybutler/nvm-windows/releases
    pause
    exit /b
)

REM Instalar la version de Node requerida
set NODE_VERSION=22.12.0

echo Instalando Node.js v%NODE_VERSION% ...
nvm install %NODE_VERSION%

REM Usar la nueva version
echo Cambiando a Node.js v%NODE_VERSION% ...
nvm use %NODE_VERSION%

REM Mostrar versiones actuales
echo -------------------------------------
node -v
npm -v
echo -------------------------------------

echo Listo! Node.js fue actualizado correctamente.
pause
