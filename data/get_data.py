#!/usr/bin/env python
# coding=utf-8

import json
import urllib
from copy import copy
from couchdb.client import Server, Database
from xml.dom import minidom


def main():
	countries = ['AFG','ALA','ALB','DZA','ASM','AND','AGO','AIA','ATG','ARG','ARM','ABW','AUS','AUT','AZE','BHS','BHR','BGD','BRB','BLR','BEL','BLZ','BEN','BMU','BTN','BOL','BES','BIH','BWA','BRA','VGB','BRN','BGR','BFA','BDI','KHM','CMR','CAN','CPV','CYM','CAF','TCD','CHL','CHN','HKG','MAC','COL','COM','COG','COK','CRI','CIV','HRV','CUB','CUW','CYP','CZE','PRK','COD','DNK','DJI','DMA','DOM','ECU','EGY','SLV','GNQ','ERI','EST','ETH','FRO','FLK','FJI','FIN','FRA','GUF','PYF','GAB','GMB','GEO','DEU','GHA','GIB','GRC','GRL','GRD','GLP','GUM','GTM','GGY','GIN','GNB','GUY','HTI','VAT','HND','HUN','ISL','IND','IDN','IRN','IRQ','IRL','IMN','ISR','ITA','JAM','JPN','JEY','JOR','KAZ','KEN','KIR','KWT','KGZ','LAO','LVA','LBN','LSO','LBR','LBY','LIE','LTU','LUX','MDG','MWI','MYS','MDV','MLI','MLT','MHL','MTQ','MRT','MUS','MYT','MEX','FSM','MCO','MNG','MNE','MSR','MAR','MOZ','MMR','NAM','NRU','NPL','NLD','NCL','NZL','NIC','NER','NGA','NIU','NFK','MNP','NOR','PSE','OMN','PAK','PLW','PAN','PNG','PRY','PER','PHL','PCN','POL','PRT','PRI','QAT','KOR','MDA','REU','ROU','RUS','RWA','BLM','SHN','KNA','LCA','MAF','SPM','VCT','WSM','SMR','STP','SAU','SEN','SRB','SYC','SLE','SGP','SXM','SVK','SVN','SLB','SOM','ZAF','SSD','ESP','LKA','SDN','SUR','SJM','SWZ','SWE','CHE','SYR','TJK','THA','MKD','TLS','TGO','TKL','TON','TTO','TUN','TUR','TKM','TCA','TUV','UGA','UKR','ARE','GBR','TZA','USA','VIR','URY','UZB','VUT','VEN','VNM','WLF','ESH','YEM','ZMB','ZWE']
	#countries = ['AFG']

	# CouchDB
	s = Server('http://127.0.0.1:5984')
	db = s.create('country_data') if not 'country_data' in s else s['country_data']

	# http://data.worldbank.org/developers/climate-data-api
	climate_base_url = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/%(type)s/%(GCM)s/%(var)s/%(start)s/%(end)s/%(country)s.json'
	climate_base_args = {
		'type': 'mavg',
		'var': 'pr',
		'start': '1980',
		'end': '1999',
		'GCM': 'bccr_bcm2_0',
		'country': 'CAN'
	}
	kml_base_url = 'http://climatedataapi.worldbank.org/climateweb/rest/v1/country/kmlpart/%(simplification)s/%(country)s'
	kml_base_args = {
		'simplification': '.5',
		'country': 'CAN'
	}

	for country in countries:
		climate_args = copy(climate_base_args)
		kml_args = copy(kml_base_args)
		doc = {
			'_id': country,
			'fromYear': climate_args['start'],
			'toYear': climate_args['end'],
			'gcm': climate_args['GCM']
		} if not country in db else db[country]
		
		try:
			for var in ('tas', 'pr'):
				climate_args.update({
					'var': var,
					'country': country,
				})
				
				url = climate_base_url % climate_args
				handle = urllib.urlopen(url)
				data = json.loads(handle.read())

				doc[var] = data[0]['monthVals']
			
			kml_args.update({
				'country': country
			})
			url = kml_base_url % kml_args
			handle = urllib.urlopen(url)
			kml = minidom.parse(handle)

			doc['coordinates'] = [coord.childNodes[0].nodeValue.split(' ') for coord in kml.getElementsByTagName('coordinates')]

			db.save(doc)
		except: 
			print 'Failed to get %s' % country

if __name__ == '__main__':
	main()