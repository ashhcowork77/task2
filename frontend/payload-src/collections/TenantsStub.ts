import { CollectionConfig } from 'payload';

export const TenantsStub: CollectionConfig = {
  slug: 'tenants',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'verticalType',
      type: 'select',
      options: [
        { label: 'Airbnb/Short-Let', value: 'airbnb' },
        { label: 'Real Estate Agent', value: 'agent' },
        { label: 'Property Builder', value: 'builder' },
      ],
      required: true,
    },
    // Branding fields (Phase 2)
    // { name: 'logo', type: 'upload', relationTo: 'media' },
    // { name: 'primaryColor', type: 'text' },
    // { name: 'tagline', type: 'text' },
  ],
  // Access: tenant admins only (Phase 2)
};
