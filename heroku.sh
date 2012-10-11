#!/usr/bin/env bash

heroku config:add NODE_ENV="production" \
  SFDC_USERNAME="{yourusername@salesforce.com}" \
  SFDC_PASSWORD="{yourpassword}" \
  SFDC_KEY="{SFDC APP KEY}" \
  SFDC_SECRET="{SFDC APP SECRET}" \
  SFDC_ENV="production" \
  TWITTER_USER_KEY="{TWITTER USER KEY}" \
  TWITTER_USER_SECRET="{TWITTER USER SECRET}" \
  TWITTER_KEY="{TWITTER KEY}" \
  TWITTER_SECRET="{TWITTER SECRET}" \
  HASHTAG="#funonbun" \
  PHONE="{+1 555-555-1212}" \
  URL="{http://localhost:3000/demo}" 