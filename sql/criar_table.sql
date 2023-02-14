create sequence seq_emprestimo;

create table emprestimo (
    id int not null default nextval('seq_emprestimo'),
    livro text,
     text,
    constraint pk_emprestimo primary key (id)
)

select * from emprestimo

alter table clientes add constraint cpf_unique unique (cpf);