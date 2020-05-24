--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-05-10 22:26:12 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 16407)
-- Name: directors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.directors (
    directorid integer NOT NULL,
    name character varying(50) NOT NULL,
    bio character varying(1000),
    birthyear date,
    deathyear date
);


ALTER TABLE public.directors OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16405)
-- Name: directors_directorid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.directors_directorid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.directors_directorid_seq OWNER TO postgres;

--
-- TOC entry 3191 (class 0 OID 0)
-- Dependencies: 204
-- Name: directors_directorid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.directors_directorid_seq OWNED BY public.directors.directorid;


--
-- TOC entry 203 (class 1259 OID 16396)
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    genreid integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(1000)
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16394)
-- Name: genres_genreid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_genreid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_genreid_seq OWNER TO postgres;

--
-- TOC entry 3192 (class 0 OID 0)
-- Dependencies: 202
-- Name: genres_genreid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_genreid_seq OWNED BY public.genres.genreid;


--
-- TOC entry 207 (class 1259 OID 16418)
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    movieid integer NOT NULL,
    title character varying(50) NOT NULL,
    description character varying(1000),
    directorid integer NOT NULL,
    genreid integer NOT NULL,
    imageurl character varying(50),
    featured boolean
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16416)
-- Name: movies_movieid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movies_movieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.movies_movieid_seq OWNER TO postgres;

--
-- TOC entry 3193 (class 0 OID 0)
-- Dependencies: 206
-- Name: movies_movieid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movies_movieid_seq OWNED BY public.movies.movieid;


--
-- TOC entry 209 (class 1259 OID 16439)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    birthdate date
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16437)
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_userid_seq OWNER TO postgres;

--
-- TOC entry 3194 (class 0 OID 0)
-- Dependencies: 208
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- TOC entry 211 (class 1259 OID 16447)
-- Name: usersmovies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usersmovies (
    usermovieid integer NOT NULL,
    userid integer,
    movieid integer
);


ALTER TABLE public.usersmovies OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16445)
-- Name: usersmovies_usermovieid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usersmovies_usermovieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usersmovies_usermovieid_seq OWNER TO postgres;

--
-- TOC entry 3195 (class 0 OID 0)
-- Dependencies: 210
-- Name: usersmovies_usermovieid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usersmovies_usermovieid_seq OWNED BY public.usersmovies.usermovieid;


--
-- TOC entry 3032 (class 2604 OID 16410)
-- Name: directors directorid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors ALTER COLUMN directorid SET DEFAULT nextval('public.directors_directorid_seq'::regclass);


--
-- TOC entry 3031 (class 2604 OID 16399)
-- Name: genres genreid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN genreid SET DEFAULT nextval('public.genres_genreid_seq'::regclass);


--
-- TOC entry 3033 (class 2604 OID 16421)
-- Name: movies movieid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies ALTER COLUMN movieid SET DEFAULT nextval('public.movies_movieid_seq'::regclass);


--
-- TOC entry 3034 (class 2604 OID 16442)
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- TOC entry 3035 (class 2604 OID 16450)
-- Name: usersmovies usermovieid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usersmovies ALTER COLUMN usermovieid SET DEFAULT nextval('public.usersmovies_usermovieid_seq'::regclass);


--
-- TOC entry 3179 (class 0 OID 16407)
-- Dependencies: 205
-- Data for Name: directors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.directors (directorid, name, bio, birthyear, deathyear) FROM stdin;
1	Jonathan Demme	Robert Jonathan Demme was an American director, producer, and screenwriter.	1944-01-01	2017-01-01
2	Judd Apatow	Judd Apatow is an American producer, writer, director, actor and stand-up comedian.	1967-01-01	\N
6	Francis Ford Coppola	Francis Ford Coppola was born in 1939 in Detroit, Michigan, but grew up in a New York suburb in a creative, supportive Italian-American family. His father, Carmine Coppola, was a composer and musician. His mother, Italia Coppola (née Pennino), had been an actress. Francis Ford Coppola graduated with a degree in drama from Hofstra University, and did graduate work at UCLA in filmmaking.	1939-01-01	\N
7	Frank Darabont	Three-time Oscar nominee Frank Darabont was born in a refugee camp in 1959 in Montbeliard, France, the son of Hungarian parents who had fled Budapest during the failed 1956 Hungarian revolution. Brought to America as an infant, he settled with his family in Los Angeles and attended Hollywood High School.	1959-01-01	\N
8	Peter Jackson	Peter Jackson was born as an only child in a small coast-side town in New Zealand in 1961. When a friend of his parents bought him a super 8 movie camera (because she saw how much he enjoyed taking photos), the then eight-year-old Peter instantly grabbed the thing to start recording his own movies, which he made with his friends. They were usually short, but they already had the trademark that would make Jackson famous: impressive special effects, made at a very low cost.	1961-01-01	\N
9	Sidney Lumet	Sidney Lumet was a master of cinema, best known for his technical knowledge and his skill at getting first-rate performances from his actors -- and for shooting most of his films in his beloved New York. He made over 40 movies, often complex and emotional, but seldom overly sentimental. Although his politics were somewhat left-leaning and he often treated socially relevant themes in his films, Lumet didn't want to make political movies in the first place.	1924-01-01	2011-01-01
10	Stanley Kubrick	Stanley Kubrick was born in Manhattan, New York City, to Sadie Gertrude (Perveler) and Jacob Leonard Kubrick, a physician. His family were Jewish immigrants (from Austria, Romania, and Russia). Stanley was considered intelligent, despite poor grades at school. Hoping that a change of scenery would produce better academic performance, Kubrick's father sent him in 1940 to Pasadena, California, to stay with his uncle, Martin Perveler. Returning to the Bronx in 1941 for his last year of grammar school, there seemed to be little change in his attitude or his results. Hoping to find something to interest his son, Jack introduced Stanley to chess, with the desired result. Kubrick took to the game passionately, and quickly became a skilled player. Chess would become an important device for Kubrick in later years, often as a tool for dealing with recalcitrant actors, but also as an artistic motif in his films.	1928-01-01	1999-01-01
11	Martin Scorsese	Martin Charles Scorsese was born on November 17, 1942 in Queens, New York City, to Catherine Scorsese (née Cappa) and Charles Scorsese, who both worked in Manhattan's garment district, and whose families both came from Palermo, Sicily. He was raised in the neighborhood of Little Italy, which later provided the inspiration for several of his films. Scorsese earned a B.S. degree in film communications in 1964, followed by an M.A. in the same field in 1966 at New York University's School of Film. During this time, he made numerous prize-winning short films including The Big Shave (1967), and directed his first feature film, Who's That Knocking at My Door (1967).	1942-01-01	\N
12	Bryan Singer	Bryan Singer was born on September 17, 1965 in New York City, New York, USA as Bryan Jay Singer. He is a producer and director, known for X-Men (2000), The Usual Suspects (1995) and X-Men: Days of Future Past (2014).	1965-01-01	\N
13	Hayao Miyazaki	Hayao Miyazaki was born in Tokyo on January 5, 1941. He started his career in 1963 as an animator at the Toei Douga studio, and was subsequently involved in many early classics of Japanese animation. From the beginning, he commanded attention with his incredible drawing ability and the seemingly endless stream of movie ideas he proposed.	1941-01-01	\N
14	Quentin Tarantino	Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old.	1963-01-01	\N
\.


--
-- TOC entry 3177 (class 0 OID 16396)
-- Dependencies: 203
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (genreid, name, description) FROM stdin;
2	Animated	Animation is a method in which pictures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film.
3	Comedy	Comedy is a genre of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect.
1	Thriller	Thriller film, also known as suspense film or suspense thriller, is a broad film genre that involves excitement and suspense in the audience. Tension is created by delaying what the audience sees as inevitable, and is built through situations that are menacing or where escape seems impossible.
4	Drama	Within film, television and radio (but not theatre), drama is a genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone, focusing on in-depth development of realistic characters who must deal with realistic emotional struggles.
5	Fantasy	Fantasy is a genre of speculative fiction set in a fictional universe, often inspired by real world myth and folklore. Its roots are in oral traditions, which then became fantasy literature and drama. From the twentieth century it has expanded further into various media, including film, television, graphic novels, manga and video games.
6	Crime	A crime story is about a crime that is being committed or was committed. It can also be an account of a criminal's life. It often falls into the action or adventure genres.
\.


--
-- TOC entry 3181 (class 0 OID 16418)
-- Dependencies: 207
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movies (movieid, title, description, directorid, genreid, imageurl, featured) FROM stdin;
1	Silence of the Lambs	A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.	1	1	silenceofthelambs.png	t
2	The Shawshank Redemption	Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.	7	4	\N	\N
3	Dr. Strangelove	An insane general triggers a path to nuclear holocaust that a War Room full of politicians and generals frantically tries to stop.	10	1	\N	\N
4	The Departed	An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.	11	6	\N	\N
5	The Usual Suspects	A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup.	12	6	\N	\N
6	12 Angry Men	A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.	9	4	\N	\N
7	The Lord of the Rings: The Fellowship of the Ring	A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.	8	5	\N	\N
8	Goodfellas	The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.	11	6	\N	\N
9	Spirited Away	During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.	13	2	\N	\N
10	Apocalypse Now	A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel who sees himself as a god.	6	4	\N	\N
11	Reservoir Dogs	When a simple jewelry heist goes horribly wrong, the surviving criminals begin to suspect that one of them is a police informant.	14	6	\N	\N
\.


--
-- TOC entry 3183 (class 0 OID 16439)
-- Dependencies: 209
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (userid, username, password, email, birthdate) FROM stdin;
2	russSTman	rusty99	russstman@aol.com	1992-11-09
3	cowgurl	sierramoon	greeniequeenie@hotmail.com	1991-12-01
1	tagbumalert	freezetagonly	tagbums42@yahoo.com	1992-01-20
\.


--
-- TOC entry 3185 (class 0 OID 16447)
-- Dependencies: 211
-- Data for Name: usersmovies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usersmovies (usermovieid, userid, movieid) FROM stdin;
1	1	2
2	2	6
3	3	1
4	1	3
5	2	5
\.


--
-- TOC entry 3196 (class 0 OID 0)
-- Dependencies: 204
-- Name: directors_directorid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directors_directorid_seq', 14, true);


--
-- TOC entry 3197 (class 0 OID 0)
-- Dependencies: 202
-- Name: genres_genreid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_genreid_seq', 6, true);


--
-- TOC entry 3198 (class 0 OID 0)
-- Dependencies: 206
-- Name: movies_movieid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movies_movieid_seq', 13, true);


--
-- TOC entry 3199 (class 0 OID 0)
-- Dependencies: 208
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_userid_seq', 3, true);


--
-- TOC entry 3200 (class 0 OID 0)
-- Dependencies: 210
-- Name: usersmovies_usermovieid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usersmovies_usermovieid_seq', 5, true);


--
-- TOC entry 3039 (class 2606 OID 16415)
-- Name: directors directors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (directorid);


--
-- TOC entry 3037 (class 2606 OID 16404)
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genreid);


--
-- TOC entry 3041 (class 2606 OID 16426)
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movieid);


--
-- TOC entry 3043 (class 2606 OID 16444)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- TOC entry 3045 (class 2606 OID 16452)
-- Name: usersmovies usersmovies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usersmovies
    ADD CONSTRAINT usersmovies_pkey PRIMARY KEY (usermovieid);


--
-- TOC entry 3047 (class 2606 OID 16432)
-- Name: movies directorkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT directorkey FOREIGN KEY (directorid) REFERENCES public.directors(directorid);


--
-- TOC entry 3046 (class 2606 OID 16427)
-- Name: movies genrekey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT genrekey FOREIGN KEY (genreid) REFERENCES public.genres(genreid);


--
-- TOC entry 3049 (class 2606 OID 16458)
-- Name: usersmovies moviekey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usersmovies
    ADD CONSTRAINT moviekey FOREIGN KEY (movieid) REFERENCES public.movies(movieid);


--
-- TOC entry 3048 (class 2606 OID 16453)
-- Name: usersmovies userkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usersmovies
    ADD CONSTRAINT userkey FOREIGN KEY (userid) REFERENCES public.users(userid);


-- Completed on 2020-05-10 22:26:13 EDT

--
-- PostgreSQL database dump complete
--

