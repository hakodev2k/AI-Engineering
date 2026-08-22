param(
    [string]$Solution = "",
    [switch]$SkipRestore
)

$ErrorActionPreference = "Stop"

function Invoke-Step([string]$Name, [scriptblock]$Action) {
    Write-Host "==> $Name"
    & $Action
    if ($LASTEXITCODE -ne 0) {
        throw "$Name failed with exit code $LASTEXITCODE"
    }
}

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Error "dotnet SDK was not found on PATH."
    exit 2
}

if ([string]::IsNullOrWhiteSpace($Solution)) {
    $candidates = @(Get-ChildItem -Path . -File -Filter *.sln -ErrorAction SilentlyContinue)
    if ($candidates.Count -eq 1) {
        $Solution = $candidates[0].FullName
    } elseif ($candidates.Count -eq 0) {
        $projects = @(Get-ChildItem -Path . -Recurse -File -Filter *.csproj -ErrorAction SilentlyContinue)
        if ($projects.Count -eq 1) {
            $Solution = $projects[0].FullName
        } else {
            Write-Error "Pass -Solution when the repository does not contain exactly one .sln/.csproj target."
            exit 2
        }
    } else {
        Write-Error "Multiple solution files found. Pass -Solution explicitly."
        exit 2
    }
}

if (-not (Test-Path $Solution)) {
    Write-Error "Target not found: $Solution"
    exit 2
}

try {
    if (-not $SkipRestore) {
        Invoke-Step "Restore" { dotnet restore $Solution }
    }
    Invoke-Step "Build" { dotnet build $Solution --no-restore --configuration Release }
    Invoke-Step "Test" { dotnet test $Solution --no-build --configuration Release --logger "console;verbosity=normal" }
    Write-Host "Verification passed: $Solution"
    exit 0
}
catch {
    Write-Error $_
    exit 1
}
