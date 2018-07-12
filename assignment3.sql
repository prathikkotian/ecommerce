alter table products modify column asin varchar(50);
alter table products modify column product_name varchar(1000);
alter table products modify column product_description varchar(50000);
alter table products modify column groups varchar(200);

alter table products modify fulltext(product_name, product_description);
