create table name_basics
(
  nconst             varchar(10)  not null,
  primary_name       varchar(50)  null,
  birth_year         int          null,
  death_year         int          null,
  primary_profession varchar(128) null,
  known_for_title_1  varchar(10)  null,
  known_for_title_2  varchar(10)  null,
  known_for_title_3  varchar(10)  null,
  known_for_title_4  varchar(10)  null,
  constraint name_basics_nconst_uindex
  unique (nconst)
);

alter table name_basics
  add primary key (nconst);

create table title_akas
(
  tconst            varchar(10)  not null,
  ordering          int          null,
  title             varchar(128) null,
  region            varchar(5)   null,
  language          varchar(5)   null,
  types             varchar(50)  null,
  attributes        varchar(50)  null,
  is_original_title tinyint(1)   null,
  constraint title_akas_tconst_uindex
  unique (tconst)
);

alter table title_akas
  add primary key (tconst);

create table title_basics
(
  tconst          varchar(10) not null,
  title_type      varchar(20) null,
  primary_title   varchar(50) null,
  original_title  varchar(50) null,
  is_adult        tinyint(1)  null,
  start_year      int         null,
  end_year        int         null,
  runtime_minutes int         null,
  genres          varchar(50) null,
  constraint title_basics_tconst_uindex
  unique (tconst)
);

alter table title_basics
  add primary key (tconst);

create table title_crew
(
  tconst    varchar(10) not null,
  directors varchar(50) null,
  writers   varchar(50) null,
  constraint title_crew_tconst_uindex
  unique (tconst)
);

alter table title_crew
  add primary key (tconst);

create table title_episode
(
  tconst         varchar(10) not null,
  parent_tconst  varchar(10) null,
  season_number  int         null,
  episode_number int         null,
  constraint title_episode_tconst_uindex
  unique (tconst)
);

alter table title_episode
  add primary key (tconst);

create table title_principles
(
  tconst     varchar(10)  not null,
  ordering   int          null,
  nconst     varchar(10)  null,
  category   varchar(25)  null,
  job        varchar(50)  null,
  characters varchar(128) null,
  constraint title_principles_tconst_uindex
  unique (tconst)
);

alter table title_principles
  add primary key (tconst);

create table title_ratings
(
  tconst         varchar(10) not null,
  average_rating float       null,
  num_votes      int         null,
  constraint title_ratings_tconst_uindex
  unique (tconst)
);

alter table title_ratings
  add primary key (tconst);
