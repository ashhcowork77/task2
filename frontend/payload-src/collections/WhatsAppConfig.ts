import type { CollectionConfig } from 'payload';

export const WhatsAppConfig: CollectionConfig = {
  slug: 'whatsapp-config',
  labels: {
    singular: 'WhatsApp Configuration',
    plural: 'WhatsApp Configurations',
  },

  // Single instance collection
  admin: {
    useAsTitle: 'whatsappNumber',
    description: 'Configure WhatsApp Business API or direct link settings for the chat widget.',
    defaultColumns: ['whatsappNumber', 'mode', 'enabled'],
  },

  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },

  fields: [
    // Enable/Disable
    {
      name: 'enabled',
      label: 'Enable WhatsApp Widget',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show WhatsApp chat widget on the website',
      },
    },

    // Mode Selection
    {
      name: 'mode',
      label: 'Integration Mode',
      type: 'select',
      required: true,
      defaultValue: 'direct_link',
      options: [
        {
          label: 'Direct Link (Free)',
          value: 'direct_link',
        },
        {
          label: 'WhatsApp Business API',
          value: 'business_api',
        },
      ],
      admin: {
        description: 'Choose how to integrate WhatsApp on your site',
      },
    },

    // Basic Settings (for both modes)
    {
      name: 'whatsappNumber',
      label: 'WhatsApp Number',
      type: 'text',
      required: true,
      admin: {
        description: 'Your WhatsApp business number with country code (e.g., +91 98765 43210)',
        placeholder: '+91 98765 43210',
      },
    },
    {
      name: 'messageTemplate',
      label: 'Default Message Template',
      type: 'textarea',
      defaultValue: "Hi! I'm interested in your properties. Can you help?",
      admin: {
        rows: 4,
        description: 'Pre-filled message that appears when users click WhatsApp. Use {property_title} to insert property name dynamically.',
      },
    },

    // Business API Credentials (shown when mode = business_api)
    {
      name: 'businessApiCredentials',
      label: 'Business API Credentials',
      type: 'group',
      admin: {
        description: 'Enter your WhatsApp Business API credentials (shown when Business API mode is selected)',
        condition: (_, siblingData) => siblingData?.mode === 'business_api',
      },
      fields: [
        {
          name: 'apiKey',
          label: 'API Key',
          type: 'text',
          admin: {
            description: 'Your WhatsApp Business API access token',
          },
        },
        {
          name: 'businessAccountId',
          label: 'Business Account ID',
          type: 'text',
          admin: {
            description: 'Your Facebook Business Manager account ID',
          },
        },
        {
          name: 'phoneNumberId',
          label: 'Phone Number ID',
          type: 'text',
          admin: {
            description: 'The Phone Number ID from your WhatsApp Business API setup',
          },
        },
        {
          name: 'webhookVerifyToken',
          label: 'Webhook Verify Token',
          type: 'text',
          admin: {
            description: 'Token used to verify webhook callbacks from WhatsApp',
          },
        },
      ],
    },

    // Widget Display Settings
    {
      name: 'widgetSettings',
      label: 'Widget Settings',
      type: 'group',
      fields: [
        {
          name: 'position',
          label: 'Widget Position',
          type: 'select',
          defaultValue: 'bottom_right',
          options: [
            { label: 'Bottom Right', value: 'bottom_right' },
            { label: 'Bottom Left', value: 'bottom_left' },
          ],
        },
        {
          name: 'theme',
          label: 'Widget Theme',
          type: 'select',
          defaultValue: 'green',
          options: [
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
            { label: 'White', value: 'white' },
          ],
        },
        {
          name: 'greetingMessage',
          label: 'Online Greeting',
          type: 'text',
          defaultValue: "Hi there! How can we help you today?",
          admin: {
            description: 'Message shown when team is online',
          },
        },
        {
          name: 'awayMessage',
          label: 'Away Message',
          type: 'text',
          defaultValue: "We're currently away. Please leave a message and we'll get back to you soon.",
          admin: {
            description: 'Message shown when team is offline',
          },
        },
      ],
    },

    // Widget Script (for advanced customizations)
    {
      name: 'widgetScript',
      label: 'Custom Widget Script',
      type: 'textarea',
      admin: {
        rows: 6,
        description: 'Optional custom JavaScript for advanced widget configuration (e.g., third-party chat providers)',
      },
    },

    // Show/Hide on Pages
    {
      name: 'showOnPages',
      label: 'Show On Pages',
      type: 'select',
      hasMany: true,
      defaultValue: ['property_detail', 'inquiry_form', 'floating_bar', 'agent_profile'],
      options: [
        { label: 'Property Detail Page', value: 'property_detail' },
        { label: 'Inquiry Form', value: 'inquiry_form' },
        { label: 'Floating Action Bar', value: 'floating_bar' },
        { label: 'Agent Profile Page', value: 'agent_profile' },
        { label: 'Homepage', value: 'homepage' },
        { label: 'Properties List', value: 'properties_list' },
      ],
      admin: {
        description: 'Select which pages should show the WhatsApp widget',
      },
    },

    // Operating Hours
    {
      name: 'operatingHours',
      label: 'Operating Hours',
      type: 'group',
      fields: [
        {
          name: 'timezone',
          label: 'Timezone',
          type: 'select',
          defaultValue: 'Asia/Kolkata',
          options: [
            { label: 'India (IST)', value: 'Asia/Kolkata' },
            { label: 'US Eastern', value: 'America/New_York' },
            { label: 'US Pacific', value: 'America/Los_Angeles' },
            { label: 'UK (GMT)', value: 'Europe/London' },
          ],
        },
        {
          name: 'mondayFriday',
          label: 'Monday - Friday',
          type: 'text',
          defaultValue: '9:00 AM - 7:00 PM',
        },
        {
          name: 'saturday',
          label: 'Saturday',
          type: 'text',
          defaultValue: '10:00 AM - 5:00 PM',
        },
        {
          name: 'sunday',
          label: 'Sunday',
          type: 'text',
          defaultValue: 'By Appointment',
        },
      ],
    },

    // Quick Reply Buttons
    {
      name: 'quickReplyButtons',
      label: 'Quick Reply Buttons',
      type: 'array',
      admin: {
        description: 'Quick reply buttons shown in the chat widget',
      },
      fields: [
        {
          name: 'label',
          label: 'Button Label',
          type: 'text',
          required: true,
        },
        {
          name: 'message',
          label: 'Pre-filled Message',
          type: 'text',
          required: true,
          admin: {
            description: 'Message that will be sent when this button is clicked',
          },
        },
      ],
    },

    // Advanced Features
    {
      name: 'advancedFeatures',
      label: 'Advanced Features',
      type: 'group',
      fields: [
        {
          name: 'enableClickTracking',
          label: 'Track Button Clicks',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Log WhatsApp button clicks for analytics',
          },
        },
        {
          name: 'enableLeadCapture',
          label: 'Capture Lead Details',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Collect user details before opening WhatsApp',
          },
        },
        {
          name: 'enableCrmIntegration',
          label: 'CRM Integration',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Send leads to CRM when users click WhatsApp',
          },
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure phone number is properly formatted
        if (data.whatsappNumber) {
          data.whatsappNumber = data.whatsappNumber.replace(/\s+/g, ' ').trim();
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        console.log(`[WhatsAppConfig] Configuration ${operation}: mode=${doc.mode}, enabled=${doc.enabled}`);
      },
    ],
  },
};
