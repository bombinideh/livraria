create sequence seq_emprestimos;

create table emprestimos(
    id int not null default nextval('seq_emprestimos'),    
    cliente_id int not null,
    data_devolucao datetime,
    constraint pk_emprestimo primary key (id),
    constraint fk_emprestimos_cliente_id foreign key (cliente_id) references clientes(id)

)


create table emprestimos_livros(    
    id_emprestimo int not null,
    livro_id int not null,
    constraint pk_emprestimos_livros primary key (id_emprestimo, livro_id),
    constraint fk_emprestimos_livros_livro_id foreign key (livro_id) references livros(id)
)

select * from livraria
s
alter table clientes add constraint cpf_unique unique (cpf);