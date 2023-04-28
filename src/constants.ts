export const jwtConstants = {
  secret: '`HmCE-(CkaX<:*`3P@vm+Sx)bw]8~[Ee+ab:@1xK?NOqGoTZvypaxII&I:H*bq@',
};

export enum TypeOfFlight {
  oneWay = 'one-way',
  roundTrip = 'round-trip',
}

/* to add airports to the database you need to add them below */
export const air = {
  YNHL: {
    icao: 'YNHL',
    iata: '',
    name: 'Nhill Airport',
    city: 'City',
    state: 'Victoria',
    country: 'AU',
    elevation: 454,
    lat: -36.3097000122,
    lon: 141.6410064697,
    tz: 'Australia/Melbourne',
  },
};
