# Sistema de Gestão de Autorizações de Fornecimento

## ER model
```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'fontFamily': 'monospace', 'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#888888', 'secondaryColor': '#ffffff', 'tertiaryColor': '#ffffff', 'background': '#ffffff'}}}%%
erDiagram
    direction LR

    Local ||--o{ Item : has
    Contrato ||--o{ AF : has
    AF ||--o{ Item : principalItems
    AF }o--o{ Item : afs
    AF ||--o{ Valor : has
    Item ||--o{ Valor : has

    Local {
        int id PK
        string nome UK
        string nome_normalized UK
    }

    Contrato {
        int id PK
        string numero UK
        string nome
        string endereco
        string cpf
    }

    AF {
        int id PK
        int contratoId FK
        boolean principal
        string numero UK
        string fornecedor
        string descricao
        datetime data_inicio
        datetime data_fim
        boolean status
    }

    Item {
        int id PK
        int principalId FK
        int localId FK
        string descricao
        int banda_maxima
        int banda_instalada
        datetime data_instalacao
        int quantidade
        boolean status
    }

    Valor {
        int id PK
        int itemId FK
        int afId FK
        int valor
        datetime data_inicio
        datetime data_fim
    }
```
