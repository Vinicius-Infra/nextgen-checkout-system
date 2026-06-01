-- Limpa resíduos se houver
DELETE FROM tb_produto;

-- Insere produtos de teste (Gere códigos de barras fáceis de testar)
INSERT INTO tb_produto (id, codigo_barras, nome, preco) VALUES (1, '78912345', 'Refrigerante Cola 2L', 8.50);
INSERT INTO tb_produto (id, codigo_barras, nome, preco) VALUES (2, '78954321', 'Salgadinho de Milho 100g', 5.99);
INSERT INTO tb_produto (id, codigo_barras, nome, preco) VALUES (3, '78900000', 'Chocolate Barra 90g', 7.25);

-- Ajusta o ponteiro da sequence para não dar conflito de ID primário depois
ALTER SEQUENCE tb_produto_SEQ RESTART WITH 4;