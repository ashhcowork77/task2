import pg from 'pg';

const { Client } = pg;

const now = () => new Date();

const properties = [
  {
    title: 'Villa Solace',
    description:
      'A stunning 4-bedroom luxury villa nestled in the heart of Assagao, North Goa. Villa Solace offers the perfect blend of modern amenities and traditional Goan charm. Wake up to lush green views, cool off in your private pool, and enjoy sunsets from the rooftop terrace. Just minutes from world-famous beaches like Ashwem and Morjim.',
    shortDescription:
      'Luxurious 4BR pool villa in peaceful Assagao, perfect for families and groups seeking privacy and comfort.',
    address: ['H. No. 596, Village Road', 'Mapusa', 'Goa', '403507', 'India'],
    locality: 'Assagao',
    point: [73.8389, 15.6128],
    bhkType: '4_plus_bhk',
    propertyType: 'villa',
    furnishingStatus: 'furnished',
    nightlyPrice: 18000,
    maxGuests: 12,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ['pool', 'wifi', 'ac', 'kitchen', 'parking', 'tv', 'garden', 'security', 'terrace', 'bbq_grill'],
    houseRules: 'No smoking indoors. Quiet hours after 10 PM.',
    tenantPreference: 'families',
    image: {
      alt: 'Villa Solace - Private Pool',
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
      filename: 'villa-solace-pool.jpg',
    },
  },
  {
    title: 'Rosa Blanca',
    description:
      'An exquisite 5-bedroom Portuguese-style villa in the serene village of Anjuna. Rosa Blanca seamlessly blends colonial architecture with contemporary luxury. The property features a massive garden, stunning infinity pool, and breathtaking views of the Goan countryside. Perfect for celebrations, retreats, or a memorable family vacation.',
    shortDescription:
      'Stunning 5BR Portuguese villa with infinity pool and lush gardens in charming Anjuna.',
    address: ['H. No. 1234, St. Anthony Colony', 'Mapusa', 'Goa', '403509', 'India'],
    locality: 'Anjuna',
    point: [73.7432, 15.6561],
    bhkType: '4_plus_bhk',
    propertyType: 'villa',
    furnishingStatus: 'furnished',
    nightlyPrice: 25000,
    maxGuests: 15,
    bedrooms: 5,
    bathrooms: 5,
    amenities: ['pool', 'wifi', 'ac', 'kitchen', 'parking', 'tv', 'garden', 'security', 'bbq_grill'],
    houseRules: 'No smoking indoors. Events require prior approval.',
    tenantPreference: 'families',
    image: {
      alt: 'Rosa Blanca - Villa Exterior',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
      filename: 'rosa-blanca-exterior.jpg',
    },
  },
  {
    title: 'Nova Solace',
    description:
      'A contemporary 3-bedroom villa in the trending locale of Chapora. Nova Solace offers sleek modern design with floor-to-ceiling windows that flood the space with natural light. The open-plan living area flows seamlessly to a private garden and plunge pool. Walking distance to the famous Chapora Fort and Vagator beach.',
    shortDescription: 'Modern 3BR villa with plunge pool near Chapora Fort and Vagator Beach.',
    address: ['H. No. 789, Chapora Fort Road', 'Mapusa', 'Goa', '403516', 'India'],
    locality: 'Vagator',
    point: [73.7435, 15.5933],
    bhkType: '3_bhk',
    propertyType: 'villa',
    furnishingStatus: 'furnished',
    nightlyPrice: 14000,
    maxGuests: 8,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ['pool', 'wifi', 'ac', 'kitchen', 'parking', 'tv', 'garden', 'security'],
    houseRules: 'No smoking indoors. Please respect the neighborhood.',
    tenantPreference: 'couples',
    image: {
      alt: 'Nova Solace - Modern Exterior',
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200',
      filename: 'nova-solace-exterior.jpg',
    },
  },
  {
    title: 'Luna Blanca',
    description:
      'A magnificent 4-bedroom luxury retreat in the peaceful village of Siolim. Luna Blanca features a stunning rectangular pool, traditional Goan architecture with modern interiors, and a serene atmosphere perfect for relaxation. The villa is staffed with a cook and housekeeper for a truly carefree experience. Close to both beach towns and local markets.',
    shortDescription: 'Elegant 4BR villa with private pool, cook, and housekeeper in tranquil Siolim.',
    address: ['H. No. 456, Main Market Road', 'Mapusa', 'Goa', '403517', 'India'],
    locality: 'Siolim',
    point: [73.7896, 15.6289],
    bhkType: '4_plus_bhk',
    propertyType: 'villa',
    furnishingStatus: 'furnished',
    nightlyPrice: 16500,
    maxGuests: 10,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ['pool', 'wifi', 'ac', 'kitchen', 'parking', 'tv', 'garden', 'security', 'bbq_grill'],
    houseRules: 'No smoking indoors. Quiet hours after 10 PM.',
    tenantPreference: 'families',
    image: {
      alt: 'Luna Blanca - Pool View',
      url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200',
      filename: 'luna-blanca-pool.jpg',
    },
  },
];

const activities = [
  {
    title: 'Sunset Beach Yoga',
    shortDescription: 'Relaxing yoga session as the sun sets over the ocean',
    description:
      'Experience the perfect blend of wellness and natural beauty with our sunset beach yoga session. Our certified instructors guide you through calming asanas while you listen to the waves and watch the sky painted in hues of orange and pink.',
    highlights: [
      'Professional certified yoga instructor',
      'Stunning ocean views',
      'All skill levels welcome',
      'Yoga mats provided',
    ],
    duration: '2 hours',
    minGuests: 2,
    maxGuests: 15,
    price: 1500,
    includes: 'Yoga mat, water bottle, fresh coconut water, towel',
    cancellationPolicy: 'Free cancellation up to 24 hours before the experience',
    bookingLeadTime: 12,
    image: {
      alt: 'Beach yoga session',
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      filename: 'sunset-beach-yoga.jpg',
    },
  },
  {
    title: 'Local Cooking Class',
    shortDescription: 'Learn authentic regional cuisine from local chefs',
    description:
      'Dive into the rich culinary traditions of the region with our hands-on cooking class. Learn family recipes passed down through generations and discover the secrets behind authentic flavors.',
    highlights: [
      'Learn 3-4 traditional recipes',
      'Take home recipe booklet',
      'Enjoy your cooked meal',
      'Visit local spice market',
    ],
    duration: '4 hours',
    minGuests: 2,
    maxGuests: 10,
    price: 2500,
    includes: 'All ingredients, recipe booklet, lunch',
    cancellationPolicy: 'Free cancellation up to 48 hours before',
    bookingLeadTime: 24,
    image: {
      alt: 'Cooking class',
      url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
      filename: 'local-cooking-class.jpg',
    },
  },
];

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function upsertMedia(image) {
  const existing = await client.query('select id from media where filename = $1 limit 1', [image.filename]);
  if (existing.rows[0]) {
    await client.query(
      `update media
       set alt = $2, url = $3, thumbnail_u_r_l = $3, mime_type = 'image/jpeg',
           filesize = 0, width = 1200, height = 800, updated_at = $4
       where id = $1`,
      [existing.rows[0].id, image.alt, image.url, now()],
    );
    return existing.rows[0].id;
  }

  const created = await client.query(
    `insert into media
      (alt, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y, created_at, updated_at)
     values
      ($1, $2, $2, $3, 'image/jpeg', 0, 1200, 800, 50, 50, $4, $4)
     returning id`,
    [image.alt, image.url, image.filename, now()],
  );
  return created.rows[0].id;
}

async function upsertAccount() {
  const data = {
    name: 'Not Just A Stay',
    email: 'hello@notjustastay.com',
    phone: '+91 98765 43210',
    tagline: 'Luxury villa stays in North Goa',
    description: 'A curated collection of luxury villas and local experiences in North Goa.',
    primaryColor: '#2563EB',
    secondaryColor: '#111827',
    websiteUrl: 'https://real-estate-saas-frontend.vercel.app',
  };
  const existing = await client.query('select id from accounts where email = $1 limit 1', [data.email]);
  if (existing.rows[0]) {
    await client.query(
      `update accounts
       set name = $2, phone = $3, tagline = $4, description = $5,
           primary_color = $6, secondary_color = $7, website_url = $8,
           address_city = 'Mapusa', address_state = 'Goa', address_country = 'India',
           updated_at = $9
       where id = $1`,
      [
        existing.rows[0].id,
        data.name,
        data.phone,
        data.tagline,
        data.description,
        data.primaryColor,
        data.secondaryColor,
        data.websiteUrl,
        now(),
      ],
    );
    return existing.rows[0].id;
  }

  const created = await client.query(
    `insert into accounts
      (name, email, phone, tagline, description, primary_color, secondary_color, website_url,
       address_city, address_state, address_country, created_at, updated_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, 'Mapusa', 'Goa', 'India', $9, $9)
     returning id`,
    [
      data.name,
      data.email,
      data.phone,
      data.tagline,
      data.description,
      data.primaryColor,
      data.secondaryColor,
      data.websiteUrl,
      now(),
    ],
  );
  return created.rows[0].id;
}

async function upsertProperty(property) {
  const mediaId = await upsertMedia(property.image);
  const existing = await client.query('select id from properties where title = $1 limit 1', [property.title]);
  const values = [
    property.title,
    property.description,
    property.shortDescription,
    property.address[0],
    property.address[1],
    property.address[2],
    property.address[3],
    property.address[4],
    property.point[0],
    property.point[1],
    property.locality,
    property.bhkType,
    property.propertyType,
    property.furnishingStatus,
    property.bedrooms,
    property.bathrooms,
    property.maxGuests,
    property.nightlyPrice,
    property.houseRules,
    property.tenantPreference,
    mediaId,
    now(),
  ];

  let id;
  if (existing.rows[0]) {
    id = existing.rows[0].id;
    await client.query(
      `update properties
       set title = $1, description = $2, short_description = $3,
           address_street = $4, address_city = $5, address_state = $6,
           address_zip_code = $7, address_country = $8,
           geolocation = ST_SetSRID(ST_MakePoint($9, $10), 4326),
           locality = $11, bhk_type = $12, property_type = $13,
           furnishing_status = $14, bedrooms = $15, bathrooms = $16,
           max_guests = $17, nightly_price = $18, currency = 'INR',
           house_rules = $19, pet_policy = 'pets_not_allowed',
           tenant_preference = $20, featured_image_id = $21,
           status = 'published', updated_at = $22
       where id = $23`,
      [...values, id],
    );
  } else {
    const created = await client.query(
      `insert into properties
        (title, description, short_description,
         address_street, address_city, address_state, address_zip_code, address_country,
         geolocation, locality, bhk_type, property_type, furnishing_status,
         bedrooms, bathrooms, max_guests, nightly_price, currency,
         house_rules, pet_policy, tenant_preference, featured_image_id,
         status, created_at, updated_at)
       values
        ($1, $2, $3, $4, $5, $6, $7, $8,
         ST_SetSRID(ST_MakePoint($9, $10), 4326), $11, $12, $13, $14,
         $15, $16, $17, $18, 'INR',
         $19, 'pets_not_allowed', $20, $21,
         'published', $22, $22)
       returning id`,
      values,
    );
    id = created.rows[0].id;
  }

  await client.query('delete from properties_amenities where parent_id = $1', [id]);
  for (const [index, amenity] of property.amenities.entries()) {
    await client.query('insert into properties_amenities ("order", parent_id, value) values ($1, $2, $3)', [
      index,
      id,
      amenity,
    ]);
  }

  return id;
}

async function upsertActivity(activity, propertyIds) {
  const mediaId = await upsertMedia(activity.image);
  const existing = await client.query('select id from activities where title = $1 limit 1', [activity.title]);
  const values = [
    activity.title,
    activity.shortDescription,
    activity.description,
    activity.duration,
    activity.minGuests,
    activity.maxGuests,
    activity.price,
    activity.includes,
    activity.cancellationPolicy,
    mediaId,
    activity.bookingLeadTime,
    now(),
  ];

  let id;
  if (existing.rows[0]) {
    id = existing.rows[0].id;
    await client.query(
      `update activities
       set title = $1, short_description = $2, description = $3,
           duration = $4, group_size_min_guests = $5, group_size_max_guests = $6,
           price = $7, currency = 'INR', includes = $8, cancellation_policy = $9,
           featured_image_id = $10, booking_lead_time = $11, status = 'published',
           updated_at = $12
       where id = $13`,
      [...values, id],
    );
  } else {
    const created = await client.query(
      `insert into activities
        (title, short_description, description, duration, group_size_min_guests,
         group_size_max_guests, price, currency, includes, cancellation_policy,
         featured_image_id, booking_lead_time, status, created_at, updated_at)
       values
        ($1, $2, $3, $4, $5, $6, $7, 'INR', $8, $9, $10, $11, 'published', $12, $12)
       returning id`,
      values,
    );
    id = created.rows[0].id;
  }

  await client.query('delete from activities_highlights where _parent_id = $1', [id]);
  for (const [index, highlight] of activity.highlights.entries()) {
    await client.query(
      'insert into activities_highlights (_order, _parent_id, id, highlight) values ($1, $2, $3, $4)',
      [index, id, `${id}-${index}`, highlight],
    );
  }

  await client.query("delete from activities_rels where parent_id = $1 and path = 'linkedProperties'", [id]);
  for (const [index, propertyId] of propertyIds.slice(0, 2).entries()) {
    await client.query(
      "insert into activities_rels (\"order\", parent_id, path, properties_id) values ($1, $2, 'linkedProperties', $3)",
      [index, id, propertyId],
    );
  }

  return id;
}

async function upsertLead(propertyId, activityId) {
  const existing = await client.query('select id from leads where email = $1 limit 1', ['guest@example.com']);
  if (existing.rows[0]) return existing.rows[0].id;

  const created = await client.query(
    `insert into leads
      (name, email, phone, message, property_reference_id, activity_reference_id,
       status, source, notes, created_at, updated_at)
     values
      ('Sample Guest', 'guest@example.com', '+91 90000 00000',
       'I am interested in booking Villa Solace for a family stay.',
       $1, $2, 'new', 'property_inquiry', 'Seed lead for testing the admin workflow.', $3, $3)
     returning id`,
    [propertyId, activityId, now()],
  );
  return created.rows[0].id;
}

async function count(table) {
  const result = await client.query(`select count(*)::int as count from ${table}`);
  return result.rows[0].count;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required.');
}

await client.connect();

try {
  await client.query('begin');

  await upsertAccount();
  const propertyIds = [];
  for (const property of properties) {
    propertyIds.push(await upsertProperty(property));
  }

  const activityIds = [];
  for (const activity of activities) {
    activityIds.push(await upsertActivity(activity, propertyIds));
  }

  await upsertLead(propertyIds[0], activityIds[0]);
  await client.query('commit');

  const counts = {
    accounts: await count('accounts'),
    properties: await count('properties'),
    activities: await count('activities'),
    leads: await count('leads'),
    media: await count('media'),
  };

  console.log('Seed complete.');
  console.table(counts);
} catch (error) {
  await client.query('rollback');
  throw error;
} finally {
  await client.end();
}
