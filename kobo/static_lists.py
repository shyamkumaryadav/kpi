# coding: utf-8
# 😬
from django.utils.translation import gettext_lazy as t

# This file is a place to store static, translatable strings

SECTOR_CHOICE_DEFAULTS = (
    # This does not solve the problem of translating custom sector choices
    # entered through the Django admin interface, but it does allow the default
    # choices to be translated

    # (value, human-readable label)
    ("Public Administration", t("Public Administration")),
    ("Arts, Entertainment, and Recreation", t("Arts, Entertainment, and Recreation")),
    ("Educational Services / Higher Education", t("Educational Services / Higher Education")),
    ("Health Services / Public Health", t("Health Services / Public Health")),
    ("Finance and Insurance", t("Finance and Insurance")),
    ("Information / Media", t("Information / Media")),
    ("Economic/Social Development", t("Economic/Social Development")),
    ("Security / Police / Peacekeeping", t("Security / Police / Peacekeeping")),
    ("Disarmament & Demobilization", t("Disarmament & Demobilization")),
    ("Environment", t("Environment")),
    ("Private sector", t("Private sector")),
    ("Humanitarian - Coordination / Information Management", t("Humanitarian - Coordination / Information Management")),
    ("Humanitarian - Multiple Clusters", t("Humanitarian - Multiple Clusters")),
    ("Humanitarian - Camp Management & Coordination", t("Humanitarian - Camp Management & Coordination")),
    ("Humanitarian - Early Recovery", t("Humanitarian - Early Recovery")),
    ("Humanitarian - Education", t("Humanitarian - Education")),
    ("Humanitarian - Emergency Shelter", t("Humanitarian - Emergency Shelter")),
    ("Humanitarian - Emergency Telecoms", t("Humanitarian - Emergency Telecoms")),
    ("Humanitarian - Food Security", t("Humanitarian - Food Security")),
    ("Humanitarian - Health", t("Humanitarian - Health")),
    ("Humanitarian - Logistics", t("Humanitarian - Logistics")),
    ("Humanitarian - Nutrition", t("Humanitarian - Nutrition")),
    ("Humanitarian - Protection", t("Humanitarian - Protection")),
    ("Humanitarian - Sanitation, Water & Hygiene", t("Humanitarian - Sanitation, Water & Hygiene")),
    ("Other", t("Other")),
)

# You might generate such a list of countries with code like this:
#
#     import sys
#
#     url = 'https://www.humanitarianresponse.info/api/v1.0/locations?filter[admin_level]=0'
#     while url:
#         print('Fetching', url, file=sys.stderr)
#         response = requests.get(url)
#         j = response.json()
#         if 'next' in j:
#             url = j['next']['href']
#         else:
#             url = None
#         for d in j['data']:
#             print("({}, t({}))".format(repr(d['iso3']), repr(d['label'])))
COUNTRIES = (
    # (value, human-readable label)
    ('AFG', 'Afghanistan'),
    ('ALA', '\xc5land Islands'),
    ('ALB', 'Albania'),
    ('DZA', 'Algeria'),
    ('ASM', 'American Samoa'),
    ('AND', 'Andorra'),
    ('AGO', 'Angola'),
    ('AIA', 'Anguilla'),
    ('ATA', 'Antarctica'),
    ('ATG', 'Antigua and Barbuda'),
    ('ARG', 'Argentina'),
    ('ARM', 'Armenia'),
    ('ABW', 'Aruba'),
    ('AUS', 'Australia'),
    ('AUT', 'Austria'),
    ('AZE', 'Azerbaijan'),
    ('BHS', 'Bahamas'),
    ('BHR', 'Bahrain'),
    ('BGD', 'Bangladesh'),
    ('BRB', 'Barbados'),
    ('BLR', 'Belarus'),
    ('BEL', 'Belgium'),
    ('BLZ', 'Belize'),
    ('BEN', 'Benin'),
    ('BMU', 'Bermuda'),
    ('BTN', 'Bhutan'),
    ('BOL', 'Bolivia, Plurinational State of'),
    ('BIH', 'Bosnia and Herzegovina'),
    ('BES', 'Bonaire, Sint Eustatius and Saba'),
    ('BWA', 'Botswana'),
    ('BVT', 'Bouvet Island'),
    ('BRA', 'Brazil'),
    ('IOT', 'British Indian Ocean Territory'),
    ('BRN', 'Brunei Darussalam'),
    ('BGR', 'Bulgaria'),
    ('BFA', 'Burkina Faso'),
    ('BDI', 'Burundi'),
    ('KHM', 'Cambodia'),
    ('CMR', 'Cameroon'),
    ('CAN', 'Canada'),
    ('CPV', 'Cape Verde'),
    ('CYM', 'Cayman Islands'),
    ('CAF', 'Central African Republic'),
    ('TCD', 'Chad'),
    ('CHL', 'Chile'),
    ('CHN', 'China'),
    ('CXR', 'Christmas Island'),
    ('CCK', 'Cocos (Keeling) Islands'),
    ('COL', 'Colombia'),
    ('COM', 'Comoros'),
    ('COG', 'Congo'),
    ('COD', 'Congo, The Democratic Republic of the'),
    ('COK', 'Cook Islands'),
    ('CRI', 'Costa Rica'),
    ('CIV', "C\xf4te d'Ivoire"),
    ('HRV', 'Croatia'),
    ('CUB', 'Cuba'),
    ('CUW', 'Cura\xe7ao'),
    ('CYP', 'Cyprus'),
    ('CZE', 'Czech Republic'),
    ('DNK', 'Denmark'),
    ('DJI', 'Djibouti'),
    ('DMA', 'Dominica'),
    ('DOM', 'Dominican Republic'),
    ('ECU', 'Ecuador'),
    ('EGY', 'Egypt'),
    ('SLV', 'El Salvador'),
    ('GNQ', 'Equatorial Guinea'),
    ('ERI', 'Eritrea'),
    ('EST', 'Estonia'),
    ('ETH', 'Ethiopia'),
    ('FLK', 'Falkland Islands (Malvinas)'),
    ('FRO', 'Faroe Islands'),
    ('FJI', 'Fiji'),
    ('FIN', 'Finland'),
    ('FRA', 'France'),
    ('GUF', 'French Guiana'),
    ('PYF', 'French Polynesia'),
    ('ATF', 'French Southern Territories'),
    ('GAB', 'Gabon'),
    ('GMB', 'Gambia'),
    ('GEO', 'Georgia'),
    ('DEU', 'Germany'),
    ('GHA', 'Ghana'),
    ('GIB', 'Gibraltar'),
    ('GRC', 'Greece'),
    ('GRL', 'Greenland'),
    ('GRD', 'Grenada'),
    ('GLP', 'Guadeloupe'),
    ('GUM', 'Guam'),
    ('GTM', 'Guatemala'),
    ('GGY', 'Guernsey'),
    ('GIN', 'Guinea'),
    ('GNB', 'Guinea-Bissau'),
    ('GUY', 'Guyana'),
    ('HTI', 'Haiti'),
    ('HMD', 'Heard Island and McDonald Islands'),
    ('VAT', 'Holy See (Vatican City State)'),
    ('HND', 'Honduras'),
    ('HKG', 'Hong Kong'),
    ('HUN', 'Hungary'),
    ('ISL', 'Iceland'),
    ('IND', 'India'),
    ('IDN', 'Indonesia'),
    ('IRN', 'Iran, Islamic Republic of'),
    ('IRQ', 'Iraq'),
    ('IRL', 'Ireland'),
    ('IMN', 'Isle of Man'),
    ('ISR', 'Israel'),
    ('ITA', 'Italy'),
    ('JAM', 'Jamaica'),
    ('JPN', 'Japan'),
    ('JEY', 'Jersey'),
    ('JOR', 'Jordan'),
    ('KAZ', 'Kazakhstan'),
    ('KEN', 'Kenya'),
    ('KIR', 'Kiribati'),
    ('PRK', "Korea, Democratic People's Republic of"),
    ('KOR', 'Korea, Republic of'),
    # Note that the addition of Kosovo is a divergence from ISO:3166 and the API
    # output from
    # https://www.humanitarianresponse.info/api/v1.0/locations?filter[admin_level]=0
    ('XKX', 'Kosovo'),
    ('KWT', 'Kuwait'),
    ('KGZ', 'Kyrgyzstan'),
    ('LAO', "Lao People's Democratic Republic"),
    ('LVA', 'Latvia'),
    ('LBN', 'Lebanon'),
    ('LSO', 'Lesotho'),
    ('LBR', 'Liberia'),
    ('LBY', 'Libya'),
    ('LIE', 'Liechtenstein'),
    ('LTU', 'Lithuania'),
    ('LUX', 'Luxembourg'),
    ('MAC', 'Macao'),
    ('MKD', 'Macedonia, The Former Yugoslav Republic of'),
    ('MDG', 'Madagascar'),
    ('MWI', 'Malawi'),
    ('MYS', 'Malaysia'),
    ('MDV', 'Maldives'),
    ('MLI', 'Mali'),
    ('MLT', 'Malta'),
    ('MHL', 'Marshall Islands'),
    ('MTQ', 'Martinique'),
    ('MRT', 'Mauritania'),
    ('MUS', 'Mauritius'),
    ('MYT', 'Mayotte'),
    ('MEX', 'Mexico'),
    ('FSM', 'Micronesia, Federated States of'),
    ('MDA', 'Moldova, Republic of'),
    ('MCO', 'Monaco'),
    ('MNG', 'Mongolia'),
    ('MNE', 'Montenegro'),
    ('MSR', 'Montserrat'),
    ('MAR', 'Morocco'),
    ('MOZ', 'Mozambique'),
    ('MMR', 'Myanmar'),
    ('NAM', 'Namibia'),
    ('NRU', 'Nauru'),
    ('NPL', 'Nepal'),
    ('NLD', 'Netherlands'),
    ('ANT', 'Netherlands Antilles'),
    ('NCL', 'New Caledonia'),
    ('NZL', 'New Zealand'),
    ('NIC', 'Nicaragua'),
    ('NER', 'Niger'),
    ('NGA', 'Nigeria'),
    ('NIU', 'Niue'),
    ('NFK', 'Norfolk Island'),
    ('MNP', 'Northern Mariana Islands'),
    ('NOR', 'Norway'),
    ('OMN', 'Oman'),
    ('PAK', 'Pakistan'),
    ('PLW', 'Palau'),
    ('PSE', 'occupied Palestinian territory'),
    ('PAN', 'Panama'),
    ('PNG', 'Papua New Guinea'),
    ('PRY', 'Paraguay'),
    ('PER', 'Peru'),
    ('PHL', 'Philippines'),
    ('PCN', 'Pitcairn'),
    ('POL', 'Poland'),
    ('PRT', 'Portugal'),
    ('PRI', 'Puerto Rico'),
    ('QAT', 'Qatar'),
    ('REU', 'R\xe9union'),
    ('ROU', 'Romania'),
    ('RUS', 'Russian Federation'),
    ('RWA', 'Rwanda'),
    ('BLM', 'Saint Barth\xe9lemy'),
    ('SHN', 'Saint Helena, Ascension and Tristan da Cunha'),
    ('KNA', 'Saint Kitts and Nevis'),
    ('LCA', 'Saint Lucia'),
    ('MAF', 'Saint Martin (French part)'),
    ('SPM', 'Saint Pierre and Miquelon'),
    ('VCT', 'Saint Vincent and the Grenadines'),
    ('WSM', 'Samoa'),
    ('SMR', 'San Marino'),
    ('STP', 'S\xe3o Tom\xe9 and Pr\xedncipe'),
    ('SAU', 'Saudi Arabia'),
    ('SEN', 'Senegal'),
    ('SRB', 'Serbia'),
    ('SYC', 'Seychelles'),
    ('SLE', 'Sierra Leone'),
    ('SGP', 'Singapore'),
    ('SXM', 'Sint Maarten (Dutch part)'),
    ('SVK', 'Slovakia'),
    ('SVN', 'Slovenia'),
    ('SLB', 'Solomon Islands'),
    ('SOM', 'Somalia'),
    ('ZAF', 'South Africa'),
    ('SGS', 'South Georgia and the South Sandwich Islands'),
    ('ESP', 'Spain'),
    ('LKA', 'Sri Lanka'),
    ('SSD', 'South Sudan'),
    ('SDN', 'Sudan'),
    ('SUR', 'Suriname'),
    ('SJM', 'Svalbard and Jan Mayen'),
    ('SWZ', 'Swaziland'),
    ('SWE', 'Sweden'),
    ('CHE', 'Switzerland'),
    ('SYR', 'Syrian Arab Republic'),
    ('TWN', 'Taiwan, Province of China'),
    ('TJK', 'Tajikistan'),
    ('TZA', 'Tanzania, United Republic of'),
    ('THA', 'Thailand'),
    ('TLS', 'Timor-Leste'),
    ('TGO', 'Togo'),
    ('TKL', 'Tokelau'),
    ('TON', 'Tonga'),
    ('TTO', 'Trinidad and Tobago'),
    ('TUN', 'Tunisia'),
    ('TUR', 'Turkey'),
    ('TKM', 'Turkmenistan'),
    ('TCA', 'Turks and Caicos Islands'),
    ('TUV', 'Tuvalu'),
    ('UGA', 'Uganda'),
    ('UKR', 'Ukraine'),
    ('ARE', 'United Arab Emirates'),
    ('GBR', 'United Kingdom'),
    ('USA', 'United States'),
    ('UMI', 'United States Minor Outlying Islands'),
    ('URY', 'Uruguay'),
    ('UZB', 'Uzbekistan'),
    ('VUT', 'Vanuatu'),
    ('VEN', 'Venezuela, Bolivarian Republic of'),
    ('VNM', 'Viet Nam'),
    ('VGB', 'Virgin Islands, British'),
    ('VIR', 'Virgin Islands, U.S.'),
    ('WLF', 'Wallis and Futuna'),
    ('ESH', 'Western Sahara'),
    ('YEM', 'Yemen'),
    ('ZMB', 'Zambia'),
    ('ZWE', 'Zimbabwe'),
)

# Whenever we add a translation that Django itself does not support, add
# information about the language here. This dictionary will be used to update
# `django.conf.locale.LANG_INFO`
EXTRA_LANG_INFO = {
    'am': {
        'bidi': False,
        'code': 'am',
        'name': 'Amharic',
        'name_local': 'አማርኛ',
    },
    'ku': {
        'bidi': True,
        'code': 'ku',
        'name': 'Kurdish',
        'name_local': 'كوردی',
    },
    'ln': {
        'bidi': False,
        'code': 'ln',
        'name': 'Lingala',
        'name_local': 'Lingala',
    },
    'ny': {
        'bidi': False,
        'code': 'ny',
        'name': 'Nyanja',
        'name_local': 'Nyanja',
    },
}

PROJECT_METADATA_DEFAULT_LABELS = {
    'sector': t('Sector'),
    'country': t('Country'),
    'operational_purpose': t('Operational purpose of data'),
    'collects_pii': t('Does this project collect personally identifiable information?'),
    'description': t('Description'),
}

USER_METADATA_DEFAULT_LABELS = {
    'name': t('Full name'),
    'organization': t('Organization'),
    'organization_type': t('Organization type'),
    'organization_website': t('Organization website'),
    'sector': t('Sector'),
    'gender': t('Gender'),
    'bio': t('Bio'),
    'city': t('City'),
    'country': t('Country'),
    'twitter': t('Twitter'),
    'linkedin': t('LinkedIn'),
    'instagram': t('Instagram'),
}
