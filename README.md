# Como rodar a aplicação

## GitHub

clone o repositório

## Instalar dependências

yarn

# Levantar o MongoDB com docker

docker-compose up

para desligar: docker-compose down

## Rodar api

use yarn dev

ou

debugger: crie uma pasta na raiz com nome de .vscode e crei um arquivo launch.json com o código abaixo:

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "OZmap",
      "skipFiles": ["<node_internals>/**"],
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

## Testes

yarn test

ou

yarn test-coverage

## Endpoints

### POST /users - Criar usuário

Exemplos de body:
{
"create" : {
"name": "Alexandre",
"email": "alexandre@mail.com",
"address": "Empire State Building, 350 5th Ave, New York, NY 10118, United States"
}
}

ou

{
"create" : {
"name": "Alexandre",
"email": "alexandre@mail.com",
"coordinates": [
-73.98565890160751,
40.74844205
]
}
}

### GET /users ou /users?page=2&limit=1 - Buscar usuários

Sem body

### GET /users/:id - Buscar usuário específico

Sem body

### PUT /users - Atualizar usuário completo

Exemplos de body:

```
{
  "create" : {
    "name": "Alexandre",
    "email": "alexandre@mail.com",
    "address": "Empire State Building, 350 5th Ave, New York, NY 10118, United States"
  }
}
```

ou

```
{
	"create" : {
		"name": "Alexandre",
		"email": "alexandre@mail.com",
		"coordinates": [
			-73.98565890160751,
			40.74844205
		]
	}
}
```

### DEL /users/:id - Deletar usuário

Sem body

### POST /regions - Criar região

Exemplo de body:

```
{
  "create": {
    "name": "Region 1",
    "user": "6727cb5422f0c692f8b15307",
    "coordinates": {
      "type": "Polygon",
      "coordinates": [
        [
          [-41.000, -28.000],
          [-41.002, -28.001],
          [-41.001, -28.003],
          [-41.000, -28.000]
        ]
      ]
    }
  }
}
```

### GET /regions?lng=-41&lat=-28 - Buscar região pela longitude e latitude

Sem body

### GET /regions/near?lng=-42&lat=-28&distance=100000 - Buscar região próximas

Sem body

### PATCH /regions - Atualizar região

Exemplo de body, sendo o envio do user obrigatório:

```
{
  "update": {
    "name": "Region 1",
    "user": "6727be1d8cb2649019e05547",
    "coordinates": {
      "type": "Polygon",
      "coordinates": [
        [
          [-41.000, -28.000],
          [-41.002, -28.001],
          [-41.001, -28.004],
          [-41.000, -28.000]
        ]
      ]
    }
  }
}
```

### PUT /regions - Atualizar região completa

Exemplo de body:

```
{
  "update": {
    "name": "Region 1",
    "user": "6727be1d8cb2649019e05547",
    "coordinates": {
      "type": "Polygon",
      "coordinates": [
        [
          [-41.000, -28.000],
          [-41.002, -28.001],
          [-41.001, -28.004],
          [-41.000, -28.000]
        ]
      ]
    }
  }
}
```

### DEL /regions/:id - Deletar região

Sem body

# OZmap Challenge: Construindo a Geolocalização do Futuro

Olá desenvolvedor(a)! Bem-vindo(a) ao Desafio Técnico do OZmap. Este é um projeto que simula um cenário real de nossa empresa, onde você irá desempenhar um papel crucial ao desenvolver uma API RESTful robusta para gerenciar usuários e localizações. Estamos muito animados para ver sua abordagem e solução!

## 🌍 **Visão Geral**

Em um mundo conectado e globalizado, a geolocalização se torna cada vez mais essencial. E aqui no OZmap, buscamos sempre otimizar e melhorar nossos sistemas. Assim, você encontrará um protótipo que precisa de sua experiência para ser corrigido, melhorado e levado ao próximo nível.

## 🛠 **Especificações Técnicas**

- **Node.js**: Versão 20 ou superior.
- **Banco de Dados**: Mongo 7+.
- **ORM**: Mongoose / Typegoose.
- **Linguagem**: Typescript.
- **Formatação e Linting**: Eslint + prettier.
- **Comunicação com MongoDB**: Deve ser feita via container.

## 🔍 **Funcionalidades Esperadas**

### Usuários

- **CRUD** completo para usuários.
- Cada usuário deve ter nome, email, endereço e coordenadas.
- Na criação, o usuário pode fornecer endereço ou coordenadas. Haverá erro caso forneça ambos ou nenhum.
- Uso de serviço de geolocalização para resolver endereço ↔ coordenadas.
- Atualização de endereço ou coordenadas deve seguir a mesma lógica.

### Regiões

- **CRUD** completo para regiões.
- Uma região é definida como um polígono em GeoJSON, um formato padrão para representar formas geográficas. Cada região tem um nome, um conjunto de coordenadas que formam o polígono, e um usuário que será o dono da região.
- Listar regiões contendo um ponto específico.
- Listar regiões a uma certa distância de um ponto, com opção de filtrar regiões não pertencentes ao usuário que fez a requisição.
- Exemplo de um polígono simples em GeoJSON:
  ```json
  {
    "type": "Polygon",
    "coordinates": [
      [
        [longitude1, latitude1],
        [longitude2, latitude2],
        [longitude3, latitude3],
        [longitude1, latitude1] // Fecha o polígono
      ]
    ]
  }
  ```

### Testes

- Unitários e de integração.

## 🌟 **Diferenciais**

- Autenticação não é requisito, podendo então o usuário ser fornecido junto do corpo da requisição. Caso implemente autenticação, o usuário deve ser obtido a partir do token.
- Interface básica de usuário.
- Documentação completa da API.
- Internacionalização.
- Cobertura de código.
- Utilização de mongo session

## ⚖ **Critérios de Avaliação**

1. Organização e clareza do código.
2. Estruturação do projeto.
3. Qualidade e eficiência do código.
4. Cobertura e qualidade de testes.
5. Pontos diferenciais citados acima.
6. Tempo de entrega.
7. Padronização e clareza das mensagens de erro.
8. Organização dos commits.
9. Implementação de logs.
10. Adesão às boas práticas de API RESTful.

## 🚀 **Entrega**

1. Crie um repositório público com a base desse código.
2. Crie uma branch para realizar o seu trabalho.
3. Ao finalizar, faça um pull request para a branch `main` deste repositório.
4. Envie um email para `rh@ozmap.com.br` informando que o teste foi concluído.
5. Aguarde nosso feedback.

---

Estamos ansiosos para ver sua implementação e criatividade em ação! Boa sorte e que a força do código esteja com você! 🚀

# ozmap
