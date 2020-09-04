create view api_observation_by_grid as 
select
	g.id,
	st_transform(g.geom, 4326) as geom, 
	avg(temperature) as temperature,
	avg(humidity) as humidity,
	avg(no2) as no2,
	avg(co) as co,
	avg(nh3) as nh3,
	avg(pm1_0) as pm1_0,
	avg(pm2_5) as pm2_5,
	avg(pm10_0) as pm10_0
from
				grid 			g 	
	left join	(
		SELECT 
			id, date_time, st_transform(geom, 25830) as geom, altitude_gps, temperature, humidity, altitude_bar, pressure, no2, co, nh3, pm1_0, pm2_5, pm10_0
		FROM 
			public.api_observation
	)							o on st_contains(g.geom , o.geom)
where
	o.id is not null
group by
	g.id,
	g.ge
