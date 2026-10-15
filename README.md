# Manuvem

Sistema web de gestão de clientes, itens e vendas, construído com Laravel, Inertia e React. O ambiente Docker atual utiliza PHP 8.5, PostgreSQL, Redis e Mailpit.

## Aviso sobre o Docker Compose

O `compose.yaml` deste repositório é uma configuração de desenvolvimento baseada no Laravel Sail, útil para testes. Ele monta o código do host, inicia a aplicação com `artisan serve` e publica portas do PostgreSQL, Redis e Mailpit. **Não exponha essa configuração diretamente à internet nem a considere pronta para produção.**

Uma implantação de produção deve adaptar a infraestrutura para PHP-FPM e Nginx, não montar o código do host, restringir as portas internas, persistir os arquivos enviados e executar um worker para filas. Também é necessário configurar HTTPS em um proxy ou servidor apropriado. Os passos abaixo apenas iniciam a configuração existente para teste.

## Pré-requisitos

- Git e acesso ao repositório.
- Docker Engine e Docker Compose instalados na máquina ou VPS.
- Portas necessárias disponíveis. Por padrão, o Compose publica a porta 80 da aplicação e também as portas do Vite, PostgreSQL, Redis e Mailpit.

## Iniciar para teste

Clone o repositório e crie o arquivo de ambiente:

```bash
git clone <URL_DO_REPOSITORIO> manuvem
cd manuvem
cp .env.example .env
```

Edite o `.env` antes de iniciar. Defina o endereço correto em `APP_URL`, mantenha `APP_DEBUG=false`, use `APP_ENV=production` e configure uma senha forte em `DB_PASSWORD`. O exemplo do projeto define `APP_ENV=prod`; ambos identificam o ambiente, mas `production` é o valor convencional do Laravel. Para este Compose, mantenha `DB_HOST=pgsql`.

Construa e inicie os serviços:

```bash
docker compose up -d --build
docker compose exec laravel.test composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
docker compose exec laravel.test pnpm install --frozen-lockfile
docker compose exec laravel.test pnpm run build
docker compose exec laravel.test php artisan key:generate
docker compose exec laravel.test php artisan migrate --force
docker compose exec laravel.test php artisan storage:link
docker compose exec laravel.test php artisan optimize
```

Com o `APP_PORT` padrão, a aplicação responde na porta 80 da máquina, por exemplo `http://IP_DA_MAQUINA`. O valor `APP_URL` não configura HTTPS por si só; para acessar por domínio com `https://`, configure TLS separadamente.

## Criar um usuário administrador com Tinker

Primeiro, crie as roles e permissões do sistema. Este passo usa apenas o seeder de permissões:

```bash
docker compose exec laravel.test php artisan db:seed --class="Database\Seeders\PermissionSeeder" --force
```

> **Não execute `php artisan db:seed --force` neste ambiente para criar o administrador.** O `DatabaseSeeder` também cria usuários de demonstração com endereços de e-mail conhecidos.

Abra o Tinker:

```bash
docker compose exec laravel.test php artisan tinker
```

No prompt do Tinker, crie o usuário e atribua a role `admin`:

```php
$user = App\Models\User::create([
    'name' => 'Administrador',
    'email' => 'admin@exemplo.com',
    'password' => 'SUBSTITUA_POR_UMA_SENHA_FORTE',
]);

$user->assignRole('admin');
$user->id;
```

Substitua o e-mail e a senha pelos valores desejados. O modelo aplica hash à senha automaticamente e cria um tenant para o usuário quando necessário. Para criar um usuário sem privilégios administrativos, troque `admin` por `user` em `assignRole`.

Digite `exit` para sair do Tinker.

## Encerrar os serviços

```bash
docker compose down
```

Os volumes de PostgreSQL e Redis são mantidos. Para removê-los junto com os serviços, seria necessário usar `docker compose down -v`; isso apaga os dados persistidos desses volumes.
