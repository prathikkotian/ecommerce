alter table products modify column asin varchar(50);
alter table products modify column product_name varchar(1000);
alter table products modify column product_description varchar(50000);
alter table products modify column groups varchar(200);

create table recommendations (
asin varchar(50),
linked_asin varchar(50)
);

create table purchase (
asin varchar(50),
username varchar(50)
);

alter table products modify fulltext(product_name, product_description);
