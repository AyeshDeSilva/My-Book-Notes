Create table booknote(
	
	id SERIAL primary key not null,
	title varchar(100) not null,
	author varchar (50) not null,
	isbn varchar(50) not null,
	review text null,
	rating numeric check(rating >= 0 and rating <= 5 )
	
);
