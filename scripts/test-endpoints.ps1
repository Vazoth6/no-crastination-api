Write-Host "=== TESTE STRAPI NO WINDOWS ===" -ForegroundColor Green
Write-Host ""

$baseUrl = "http://localhost:1337"

# 1. Testar conexão
Write-Host "1. Testando conexão com Strapi..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method Get
    Write-Host "   ✅ Strapi está rodando" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Strapi não está respondendo" -ForegroundColor Red
    Write-Host "   Erro: $_" -ForegroundColor Red
    exit
}

Write-Host ""

# 2. Testar registro
Write-Host "2. Testando registro de usuário..." -ForegroundColor Yellow
$registerBody = @{
    username = "testuser_$(Get-Date -Format 'yyyyMMddHHmmss')"
    email = "test_$(Get-Date -Format 'yyyyMMddHHmmss')@test.com"
    password = "Test123!"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/local/register" -Method Post -Body $registerBody -ContentType "application/json"
    
    Write-Host "   ✅ Registro bem-sucedido!" -ForegroundColor Green
    $token = $registerResponse.jwt
    Write-Host "   Token: $($token.Substring(0, 30))..." -ForegroundColor Cyan
    
    # 3. Testar endpoint protegido
    Write-Host ""
    Write-Host "3. Testando endpoint /users/me..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Method Get -Headers $headers
    Write-Host "   ✅ Usuário obtido com sucesso" -ForegroundColor Green
    Write-Host "   ID: $($meResponse.id)" -ForegroundColor Cyan
    Write-Host "   Username: $($meResponse.username)" -ForegroundColor Cyan
    Write-Host "   Email: $($meResponse.email)" -ForegroundColor Cyan
    
} catch {
    Write-Host "   ❌ Erro no registro: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $streamReader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $errorBody = $streamReader.ReadToEnd()
        $streamReader.Close()
        Write-Host "   Detalhes: $errorBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== FIM DO TESTE ===" -ForegroundColor Green