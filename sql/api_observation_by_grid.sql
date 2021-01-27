CREATE OR REPLACE VIEW public.api_observation_by_grid
AS SELECT g.id,
    st_transform(g.geom, 4326) AS geom,
    round(avg(o.pm1_0)::numeric, 2) AS pm1_0,
    round(avg(o.pm2_5)::numeric, 2) AS pm2_5,
    round(avg(o.pm10_0)::numeric, 2) AS pm10_0,
    mode() WITHIN GROUP (ORDER BY o.username) AS username
   FROM grid g
     LEFT JOIN ( SELECT api_observation.id,
            st_transform(api_observation.geom, 25830) AS geom,
            api_observation.pm1_0,
            api_observation.pm2_5,
            api_observation.pm10_0,
            api_observation.username
           FROM api_observation) o ON st_contains(g.geom, o.geom)
  WHERE o.id IS NOT NULL
  GROUP BY g.id, g.geom;