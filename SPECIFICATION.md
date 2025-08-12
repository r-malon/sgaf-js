# Sistema de Gestão de Autorizações de Fornecimento (SGAF)

## **1\. Objetivo**

Desenvolver um sistema web para gerenciar Autorizações de Fornecimento (AFs), seus respectivos itens e locais de instalação, permitindo controle completo de períodos, valores e históricos de alterações. O sistema permitirá rastreabilidade e clareza nos contratos e fornecimentos.

## **2\. Funcionalidades Principais**

### **2.1. Gestão de Autorizações de Fornecimento**

* Cadastro de novas AFs com os campos:

  * Número da AF (único)  
  * Fornecedor  
  * Descrição  
  * Data Inicial  
  * Data Final  
  * Status (Aberta, Fechada)

* Relacionamento com múltiplos itens. (Uma AF pode ter vários itens)

### **2.2. Gestão de Itens**

* Cadastro de itens contendo:

  * Descrição  
  * Banda Máxima  
  * Banda Instalada  
  * Data da Instalação  
  * Relacionamento com múltiplos Valor Integral Mensal ( Um item poderá ter vários valores)  
  * Relacionamento com uma AF ( Um item terá somente uma AF )  
  * Relacionamento com um Local ( Um item terá somente um Local )

* Cálculo automático do **valor total do item no período da AF** com base no valor mensal e intervalo entre as datas (Data Inicial e Final da AF).  
  **Exemplo**: A AF 123 tem o período de vigência (Intervalo entre a Data Inicial e Final) de 01/07/2025 à 01/10/2025 e o Item A desta AF tem um Valor Integral Mensal de R$50,00. Dessa forma, o valor total do item no período deve ser de R$150,00.  
  É importante mencionar que nem sempre os períodos serão de meses fechados, os valores podem ser fracionados, devendo ser feito o cálculo para essas frações corretamente. 

* Registro de alterações de valor com vigência: o sistema manterá um histórico de valores integrais mensais com datas de vigência, nunca alterando valores retroativos.  
  	**Exemplo**: A AF 123 tem o período de vigência (Intervalo entre a Data Inicial e Final) de 01/07/2025 a 01/10/2025 e o Item A desta AF tem um Valor Integral Mensal de R$50,00. Porém, no dia 01/08/2025 o valor foi alterado para R$70,00. Dessa forma, o valor total do item no período deve ser de R$190,00. (R$50,00 \+ R$70,00 \+ R$70,00)   
  É importante mencionar que nem sempre os períodos serão de meses fechados, os valores podem ser fracionados, devendo ser feito o cálculo para essas frações corretamente. 

### **2.3. Gestão de Locais**

* Cadastro de Locais contendo:

  * Nome do Local

* Relacionamento com um ou mais itens ( Um determinado local pode estar em um ou mais itens)

### **2.4. Histórico de Alterações**

* Log de todas as mudanças relevantes:

  * Alterações de valores mensais com data de início de vigência.  
  * Mudanças de status da AF.

## **3\. Modelo de Dados**

| Item |  |
| ----- | ----- |
| id | UUID |
| descricao | String |
| banda\_maxima | Integer |
| banda\_instalada | Integer |
| data\_instalacao | Date |
| quantidade | Integer |
| status | Boolean |
| af\_id (FK) | UUID |
| local\_id (FK) | UUID |

| AF |  |
| ----- | ----- |
| id | UUID |
| numero | String UNIQUE |
| fornecedor | String |
| descricao | String |
| data\_inicio | Date |
| data\_fim | Date |
| status | Boolean |

| Valor |  |
| ----- | ----- |
| id | UUID |
| item\_id (FK) | UUID |
| valor | Integer |
| data\_inicio | Date |
| data\_fim | Date NULL |

| Local |  |
| ----- | ----- |
| id | UUID |
| nome | String |

## **4\. Estrutura de Telas e Funcionalidades do Sistema**

O sistema será composto por uma interface web com as seguintes páginas:

### **4.1. Página: Cadastro de AF**

#### **Funcionalidades:**

- **Formulário com os seguintes campos:**  
  * Número (único)  
  * Fornecedor  
  * Data Inicial  
  * Data Final  
  * Status (Aberta, Fechada)  
- **Botão para incluir Items:**  
  - Abre um formulário com:  
    * Descrição  
    * Banda Máxima  
    * Banda Instalada  
    * Data da Instalação  
    * Seleção do Local  
    * Botão para incluir Valor Integral Mensal:  
      * Abre um formulário com:  
        * Valor (R$)  
        * Data de início da vigência  
        * Botão para salvar Valor Integral Mensal  
    * Botão para salvar Item.  
- **Botão para salvar/criar a AF**  
- **Durante a inclusão:**  
  - Ao clicar para salvar o valor integral:  
    - Um novo valor é adicionado na tabela de Valor e relacionado com a tabela de Item  
    - É realizado um registro na tabela de logs da criação desse valor.  
  - Ao clicar para salvar item:  
    - Um novo item é adicionado na tabela Item e relacionado com a AF atual.  
    - Esse item não pode ser relacionado com nenhuma outra AF.   
    - É realizado um registro na tabela de logs da criação deste Item  
  - Ao clicar em salvar/criar AF:  
    - Uma nova AF é adicionada na tabela de AF.   
    - É realizado um registro na tabela de logs da criação deste Item  
- **Validação:**  
  * Número de AF não pode se repetir  
  * Data Final não pode ser anterior à Data Inicial  
- **Regras**:  
  * Um item já relacionado a uma AF não poderá ser reatribuído a outra. Caso necessário, um novo item deve ser criado  
  * Após criação da AF o usuário será redirecionado para sua página de visualização

### **4.2. Página: Cadastro de Local**

#### **Funcionalidades:**

- **Formulário simples:**  
  - Nome do Local  
- **Botão de salvar/criar local**

### **4.3. Página: Listagem de AFs (Página Inicial)**

#### **Funcionalidades:**

* Filtro por:

  * Status (Ativa, Inativa, Todas)  
  * Número  
  * Fornecedor

* Lista contendo:

  * Número  
  * Fornecedor  
  * Status  
  * Período  
  * Total acumulado da AF (soma dos valores dos itens conforme vigência)

  **Obs:** Cada Item da lista deverá ser um *accordion* (se clicado, expandirá mostrando todos os itens daquela AF e o valor somado de cada item)

* Ações por linha:

  * Visualizar  
  * Editar  
  * Excluir (com confirmação)

### **4.4. Página: Visualização de uma AF**

#### **Informações exibidas:**

* Cabeçalho:

  * Número  
  * Fornecedor  
  * Status  
  * Período (Data Inicial e Final)

* Lista de Itens relacionados:

  * Descrição  
  * Banda Instalada  
  * Local de instalação  
  * Valor mensal (vigente)  
  * Valor total (calculado para o período da AF)

* Total geral da AF

* Ações:

  * Editar AF  
  * Adicionar Item (só para AFs ativas)  
  * Excluir AF (se não tiver itens relacionados)

	**Obs:** Ao clicar em Editar AF, o usuário será redirecionado para uma página igual a de criação de AF, porém com os dados preenchidos. Os logs de alterações/atualizações também devem ser salvos.

### **4.5. Página: Visualização de um Item**

#### **Informações exibidas:**

* Descrição  
* AF relacionada (link)  
* Local  
* Banda Máxima  
* Banda Instalada  
* Data da instalação  
* Valor Integral Mensal (Valor atual)  
* Valor total para o período da AF  
* Ações:

  * Editar dados do item (exceto AF)  
  * **Botão: “Visualizar histórico de valores”**  
  * **Botão: "Alterar Valor Mensal"**

    * Ao clicar, permite adicionar novo valor e data de vigência  
    * Regra: a nova vigência não pode ser retroativa  
    * Ao ser alterado o valor, o campo de data\_fim do valor antigo deverá preenchido com a data\_inicio do novo valor  
    * As datas devem ser validadas, um novo valor não poderá ser incluído com a data\_inicio inferior a data\_inicio do valor anterior.

### **4.6. Página: Visualização de um Local**

#### **Informações exibidas:**

* Nome do Local  
* Ações:

  * Editar Nome do Local  
  * Excluir Local (apenas se não houver itens relacionados)

## **5\. Regras de Negócio Reforçadas**

1. **Histórico de valores**:

   * Cada alteração no valor mensal de um item cria uma nova entrada com data de vigência.  
   * O sistema usará essa tabela para calcular o valor total do item ao longo do período da AF.

2. **Imutabilidade da AF de um item**:

   * Um item, uma vez associado a uma AF, não pode ser transferido para outra.  
   * Caso necessário, deve-se **duplicar o item** e associar à nova AF.

3. **Exclusão de entidades**:

   * Não será possível excluir uma AF com itens vinculados.  
   * Não será possível excluir um Local com itens vinculados.  
   * Itens podem ser excluídos apenas se não tiverem histórico de valor.

