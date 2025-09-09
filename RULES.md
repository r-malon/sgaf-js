| ID      | Entidade | Condição                                                 | Regra                                                    |
|---------|----------|----------------------------------------------------------|----------------------------------------------------------|
| AF-1    | AF       | `numero` já existe em outra AF                           | ❌ Rejeitar criação (`numero` é único)                   |
| AF-2    | AF       | `data_fim < data_inicio`                                 | ❌ Rejeitar criação/atualização                          |
| AF-3    | AF       | Exclusão solicitada e existem `items` relacionados       | ❌ Não permitir exclusão                                 |
| AF-4    | AF       | Status = `Ativa` e hoje > `data_fim`                     | 🔄 Transição automática para **Inativa**               |
| AF-5    | AF       | Status = `Inativa` e usuário solicita reativação         | 🔄 Transição para **Ativa** (se dentro da vigência)      |
| ITEM-1  | Item     | Relacionar item a mais de uma AF                         | ❌ Inválido (`AF_id` é obrigatório e único por item)     |
| ITEM-2  | Item     | AF associada está `Inativa`                              | ❌ Não permitir criar ou atualizar item                  |
| ITEM-3  | Item     | Exclusão solicitada e possui histórico de valores        | ❌ Não permitir exclusão                                 |
| ITEM-4  | Item     | Exclusão solicitada e **não possui valores**             | ✅ Exclusão permitida                                    |
| ITEM-5  | Item     | Primeiro valor criado                                    | 🔄 Transição estado `Ativo`                              |
| ITEM-6  | Item     | AF associada muda para `Inativa`                         | 🔄 Transição estado `Ativo` → `Inativo`                  |
| VALOR-1 | Valor    | Novo `data_inicio` < `ultimoValor.data_inicio`           | ❌ Inválido (vigência não pode ser retroativa)           |
| VALOR-2 | Valor    | Novo intervalo ultrapassa limites da AF                  | ❌ Inválido                                              |
| VALOR-3 | Valor    | Novo intervalo se sobrepõe a outro do mesmo item         | ❌ Inválido                                              |
| VALOR-4 | Valor    | Novo valor criado com `data_inicio`                      | `data_fim` do valor anterior = `novo.data_inicio`        |
| VALOR-5 | Valor    | Não existe `data_fim` (null) e `data_inicio` ≤ hoje      | Este é o **valor vigente**                              |
| VALOR-6 | Valor    | Vários valores vigentes no mesmo dia                     | ❌ Conflito → rejeitar inclusão                         |
| LOCAL-1 | Local    | Nome já existe                                           | ❌ Inválido (nome deve ser único)                       |
| LOCAL-2 | Local    | Exclusão solicitada e possui itens relacionados          | ❌ Não permitir exclusão                                |
| LOCAL-3 | Local    | Exclusão solicitada sem itens relacionados               | ✅ Exclusão permitida                                   |
| CALC-1  | Cálculo  | Item tem múltiplos valores ao longo da AF                | Calcular total prorrateando cada intervalo de vigência |
| CALC-2  | Cálculo  | Datas não caem exatamente no início/fim de mês           | Calcular proporcionalmente pelos dias                  |
| CALC-3  | Cálculo  | AF sem itens                                             | Total acumulado da AF = 0                              |
| CALC-4  | Cálculo  | Item sem valores vigentes                                | Valor total do item = 0                                |
