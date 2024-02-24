import { find } from "../utils";
import { Actor, Film } from "./api/types";

const CONNECT_THE_STARS: Film = {id: 'f0', name: 'Connect The Stars', image: find('assets/cts', 'connect_the_stars.jpg'), popularity: 0, genres: [], keywords: []};
const ERIC_BAI: Actor = {id: 'a0', name: 'Amanda Hum', image: find('assets/cts', 'amanda.jpg'), popularity: 0, credits: [CONNECT_THE_STARS], genres: [], keywords: []};
const AMANDA_HUM: Actor = {id: 'a1', name: 'Amanda Hum', image: find('assets/cts', 'eric.jpg'), popularity: 0, credits: [CONNECT_THE_STARS], genres: [], keywords: []};
const ETHAN_WOLFE: Actor = {id: 'a2', name: 'Ethan Wolfe', image: find('assets/cts', 'ethan.jpg'), popularity: 0, credits: [CONNECT_THE_STARS], genres: [], keywords: []};

export const SecretActors: Actor[] = [ERIC_BAI, AMANDA_HUM, ETHAN_WOLFE];

export const ACTOR_IDS: number[] = [
    31, // Tom Hanks,
    287, // Brad Pitt,
    6193, // Leonardo DiCaprio
    380, // Robert De Niro
    1245, // Scarlett Johansson
    134, // Jamie Foxx,
    19292, // Adam Sandler
    500, // Tom Cruise,
    16828, // Chris Evans,
    2888, // Will Smith
    1896, // Don Cheadle
    1158, // Al Pacino
    3223, // Robert Downey Jr,
    5292, // Denzel Washington
    6968, // Hugh Jackman
    2231, // Samuel L Jackson
    85, // Johnny Depp
    11288, // Robert Pattinson
    234352, // Margot Robbie
    3895, // Michael Caine
    6885, // Charlize Theron
    2157, // Robin Williams
    514, // Jack Nicholson
    524, // Natalie Portman
    1023139, // Adam Driver
    1204, // Julia Roberts
    5064, // Meryl Streep
    1461, // George Clooney
    72129, // Jennifer Lawrence
    18918, // Dwayne Johnson
    11701, // Angelina Jolie
    18277, // Sandra Bullock
    1892, // Matt Damon
    206, // Jim Carrey
    2227, // Nicole Kidman
    112, // Cate Blanchett
    1327, // Ian McKellen
    192, // Morgan Freeman
    73421, // Joaquin Phoenix
    10297, // Matthew McConaughey
    131, // Jake Gyllenhaal
    5309, // Judi Dench
    19492, // Viola Davis
    10205, // Sigourney Weaver
    116, // Kiera Knightley
    9273, // Amy Adams
    140, // Lucy Liu
    4587, // Halle Berry
    776, // Eddie Murphy
    55638, // Kevin Hart
    6384, // Keanu Reeves
    17605, // Idris Elba
    1267329, // Lupita Nyong'o
    37917, // Kristen Stewart
    11856, // Daniel Day Lewis
    62, // Bruce Willis
    18897, // Jackie Chan
    54693, // Emma Stone
    6941, // Cameron Diaz
    934, // Russell Crowe
    30614, // Ryan Gosling
    4724, // Kevin Bacon
    10859, // Ryan Reynolds
    57755, // Woody Harrelson
    70851, // Jack Black
    884, // Steve Buscemi
    1813, // Anne Hathaway
    4517, // Joe Pesci
    83002, // Jessica Chastain
    64, // Gary Oldman
    13240, // Mark Wahlberg
    5472, // Colin Firth
    1229, // Jeff Bridges
    2963, // Nicolas Cage
    60073, // Brie Larson
    10990, // Emma Watson
    880, // Ben Affleck
    3, // Harrison Ford
    3063, // Tilda Swinton
    4784, // Laura Dern
    32, // Robin Wright
    53714, // Rachel McAdams
    9281, // Elizabeth Banks
    24045, // Joseph Gordon Levitt
    21007, // Jonah Hill
    5293, // Willem Dafoe
    1532, // Bill Murray
    5081, // Emily Blunt
    3896, // Liam Neeson
    10882, // Rosamund Pike
    90633, // Gal Gadot
    139, // Uma Thurman
    71070, // Amanda Seyfried
    56734, // Chloe Grace Moretz
    18973, // Mila Kunis
    3489, // Naomi Watts
    9827, // Rose Byrne
    6161, // Jennifer Connelly
    3967, // Kate Beckinsale
    4483, // Dustin Hoffman
    1231, // Julianne Moore
    37153, // Zoe Kravitz
    27578, // Ellen Page
    1038, // Jodie Foster
    3293, // Rachel Weisz
    1283, // Helena Bonham Carter
    1579, // Maggie Gyllenhaal
    1920, // Winona Ryder
    204, // Kate Winslet
    205, // Kirsten Dunst
    36592, // Saoirse Ronan
    51329, // Bradley Cooper
    4491, // Jennifer Aniston
    505710, // Zendaya
    2037, // Cillian Murphy
    23659, // Will Ferrell
    118545, // Dakota Johnson
    40462, // Kristen Bell
    27319, // Christoph Waltz
    9642, // Jude Law
    84223, // Anna Kendrick
    1812, // Michelle Williams
    12052, // Gwyneth Paltrow
    62561, // Tessa Thompson
    368, // Reese Witherspoon
    68842, // John Cho
    76788, // Dev Patel
    55536, // Melissa McCarthy
    52792, // Maya Rudolph
    108916, // Rooney Mara
    17628, // Mary Elizabeth Winstead
    9788, // Regina King
    6944, // Octavia Spencer
    16866, // Jennifer Lopez
    5723, // John Leguizamo
    2047, // Danny Glover
    1625558, // Awkwafina
    1100 // Arnold Schwarzenegger
];
// 69 men
// 69 women
// 26 non-white

export const EXPANDED_ACTOR_IDS: number[] = [
    // men
    17142, // Paul Dano
    17276, // Gerard Butler
    17419, // Bryan Cranston
    1230, // John Goodman
    190, //  Clint Eastwood
    67773, // Steve Martin
    741, // River Phoenix
    723, // Patrick Swayze
    3636, // Paul Newman
    518, // Danny DeVito
    2176, // Tommy Lee Jones
    7447, // Alec Baldwin
    7399, // Ben Stiller
    1269, // Kevin Costner
    55638, // Kevin Hart*
    38673, // Channing Tatum
    3131, // Antonio Banderas*
    887, // Owen Wilson
    8349, // Martin Sheen
    72466, // Colin Farrell
    10814, // Wesley Snipes*
    29222, // Zac Efron
    4690, // Christopher Walken
    3291, // Hugh Grant
    2628, // Kiefer Sutherland
    12073, // Mike Myers
    6065, // Dennis Quaid
    3084, // Marlon Brando
    5576, // Val Kilmer
    4785, // Jeff Goldblum
    2295, // Mickey Rourke
    2048, // Gary Busey
    8447, // Jeff  Daniels
    1062, // Christopher Lloyd
    23532, // Jason Bateman
    228, // Ed Harris,
    10127, // Jon Voight
    10959, // Shia LaBeouf
    6949, // John Malkovich
    819, // Edward Norton
    290, // Christopher Plummer
    1233, // Philip Seymour Hoffman
    62064, // Chris  Pine
    44735, // Jesse  Eisenberg
    36422, // Luke Wilson
    4566, // Alan Rickman
    2524, // Tom Hardy
    55636, // Donald Sutherland
    34490, // Ben Kingsley*
    3490, // Adrien Brody
    2178, // Forest Whitaker
    // women
    8944, // Jamie Lee Curtis
    41091, // Kristen Wiig
    3910, // Frances McDormand
    9278, // Jennifer Garner
    955, // Penelope Cruz*
    69597, // Drew Barrymore
    5344, // Meg Ryan
    119592, // Aubrey Plaza
    3416, // Demi Moore
    5823, // Julie Andrews
    35, // Sally Field
    2395, // Whoopi Goldberg*
    49265, // Linday Lohan
    15758, // Queen Latifah*
    1160, // Michelle Pfeiffer
    515, // Glenn Close
    6352, // Jane Fonda
    4430, // Sharon Stone
    3092, // Diane Keaton
    56731, // Jessica Alba*
    9994, // Helen Hunt
    9137, // Renee Zellweger
    21625, // Molly Ringwald
    4038, // Susan Sarandon
    501, // Dakota Fanning
    56322, // Amy Poehler
    6450, // Faye Dunaway
    7404, // Sarah Silverman
    7056, // Emma Thompson
    43775, // Jane Lynch
    5606, // Sissy Spacek
    16935, // Geena Davis
    4687, // Patricia Arquette
    15735, // Helen Mirrin
    5657, // Anjelica Huston
    59315, // Olivia Wilde
    18686, // Holly Hunter
    11703, // Kerry Washington*
    11664, // Zooey Deschanel
    1397778, // Anya Taylor-Joy
    17773, // Gabrielle Union*
    25540, // Sandra Oh*
    5916, // Rosario Dawson*
    17647, // Michelle Rodriguez*
    10431, // Jennifer Jason Leigh
    1772, // Anna Faris
    18050, // Elle Fanning
    80591, // Rashida Jones*
    34490, // Sarah Paulson
    32798, // Elizabeth Moss
    1230868, // Tiffany Haddish*
    10690, // Anna Paquin
    19119 // Melanie Laurent
];
// 51 men
// 51 women
// 15 non-white

export const BOLLYWOOD_ACTOR_IDS: number[] = [
    // men
    35070, // Akshay Kumar
    42802, // Salman Khan
    42803, // Ajay Devgn
    35742, // Shah Rukh Khan
    52763, // Aamir Khan
    78749, // Hrithik Roshan
    35793, // Abhishek Bachchan
    35780, // Amitabh Bachchan
    84957, // Ritesh Deshmukh
    35747, // Saif Ali Khan
    85034, // Ranbir Kapoor ?
    224223, // Ranveer Singh ?
    78245, // Shahid Kapoor
    52971, // John Abraham
    85881, // Sanjay Dutt
    85969, // Emraan Hashmi
    72118, // Anil Kapoor
    77235, // Bobby Deol
    86302, // Sunny Deol
    52263, // Arjun Rampal
    76793, // Irrfan Khan
    85889, // Arshad Warsi
    85730, // Sunil Shetty
    85891, // Tusshar Kapoor
    87328, // Akshaye Khanna
    84956, // Nana Patekar
    97546, // Govinda
    117727, // Rajkummar Rao
    85668, // Vivek Oberoi
    6497, // Naseeruddin Shah
    6217, // Anupam Kher,
    1033157, // Ayushmann Khurrana
    // women
    81869, // Katrina Kaif
    37233, // Kareena Kapoor Khan
    53975, // Deepika Padukone
    77234, // Priyanka Chopra
    81928, // Anushka Sharma
    130958, // Sonakshi Sinha
    85040, // Sonam Kapoor ?
    130991, // Shraddha Kapoor
    35068, // Vidya Balan
    55061, // Kajol
    35776, // Rani Mukerji
    87773, // Aishwarya Rai Bachchan
    85470, // Kangana Ranaut
    550167, // Taapsee Pannu
    85035, // Bipasha Basu
    55062, // Tabu
    76232, // Madhuri Dixit
    35745, // Preity Zinta
    76233, // Karisma Kapoor
    55063, // Lara Dutta
    35810, // Juhi Chawla
    86077, // manisha-koirala
    76450, // Ameesha Patel
    86060, // Shilpa Shetty Kundra
    86075, // urmila-matondkar
    123180, // raveena-tandon
    85890, // Amrita Rao
    88138, // Sushmita Sen
    53672, // Soha Ali Khan
    95505, // Jacqueline Fernandez
    85883, // Shruti Haasan
    1108120 // Alia Bhatt
];

// 32 men
// 32 women

export const PRE_BLOCKBUSTER_IDS: number[] = [
    12446, // Peter Sellers
    11147, // John Cassavetes
    8487, // Gregory Peck
    2638, // Cary Grant
    8252, // William Holden
    4110, // Humphrey Bogart
    3151, // Jack Lemmon
    2091, // James Mason
    3636, // Paul Newman
    4135, // Robert Redford
    2090, // Kirk Douglas
    3359, // Laurence Olivier
    4958, // Henry Fonda
    854, // James Stewart
    13294, // Gene Kelly
    3150, // Tony Curtis
    2749, // James Dean
    10158, // Robert Mitchum
    40, // Orson Welles
    13848, // Charlie Chaplin
    4165, // John Wayne
    3460, // Gene Wilder
    11492, // Clark Gable
    // women
    7302, // Janet Leigh
    12021, // Mia Farrow
    4970, // Ruth Gordon
    1932, // Audrey Hepburn
    7632, // Shelley Winters
    9594, // Katharine Ross
    4070, // Grace Kelly
    2639, // Eva Marie Saint
    3149, // Marilyn Monroe
    10538, // Vivien Leigh
    15385, // Alida Valli
    14974, // Barbara Stanwyck
    13992, // Mary Astor
    4111, // Ingrid Bergman
    7570, // Lauren Bacall
    6598, // Katharine Hepburn
    9066, // Judy Garland
    3635, // Elizabeth Taylor
    8857, // Debbie Reynolds
    4090, // Shirley Maclaine
    11165, // Jane Russell
    2769 // Natalie Wood
];

export const Datasets: {[key: string]: number[]} = {
    use_default: ACTOR_IDS,
    use_expanded: EXPANDED_ACTOR_IDS,
    use_bollywood: BOLLYWOOD_ACTOR_IDS,
    use_blockbuster: PRE_BLOCKBUSTER_IDS
}
