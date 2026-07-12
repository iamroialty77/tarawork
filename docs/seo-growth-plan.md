# TaraWork SEO Growth Plan

## Immediate Google Search Console Steps

1. Submit `https://www.tarawork.online/sitemap.xml`.
2. Request indexing for:
   - `https://www.tarawork.online/`
   - `https://www.tarawork.online/hire-filipino-freelancers`
   - `https://www.tarawork.online/virtual-assistant-philippines`
   - `https://www.tarawork.online/remote-jobs-philippines`
   - `https://www.tarawork.online/hire-filipino-web-developer`
   - `https://www.tarawork.online/hire-filipino-social-media-manager`
   - `https://www.tarawork.online/virtual-assistant-rates-philippines`
3. Check Search Console weekly:
   - Performance > Queries
   - Performance > Pages
   - Indexing > Pages
   - Links > External links

## Priority Keywords

- hire Filipino freelancers
- virtual assistant Philippines
- hire virtual assistant Philippines
- hire Filipino web developer
- hire Filipino social media manager
- virtual assistant rates Philippines
- remote jobs Philippines
- freelance jobs Philippines

## Weekly Content Plan

Publish one helpful page per week. Each page should have:

- One clear H1 with the target keyword.
- 800 to 1,500 words of useful content.
- A FAQ section with 3 to 5 questions.
- Internal links to service pages, homepage, and signup.
- A clear audience: employer or freelancer.

Suggested pages:

- `/hire-filipino-graphic-designer`
- `/hire-filipino-content-writer`
- `/hire-filipino-customer-support`
- `/hire-ecommerce-virtual-assistant-philippines`
- `/best-tasks-to-delegate-to-a-virtual-assistant`
- `/how-to-hire-a-virtual-assistant-philippines`
- `/freelance-jobs-philippines-guide`

## Backlink Plan

Every week, create at least 5 external mentions:

- LinkedIn post linking to a guide page.
- Facebook business/freelancer group post where allowed.
- Partner or client website mention.
- Freelancer profile shares linking back to TaraWork.
- Local startup, business, or freelancer directory submission.

Use varied anchor text:

- TaraWork
- hire Filipino freelancers
- Filipino virtual assistant marketplace
- remote jobs Philippines
- hire remote Filipino talent

## Product Changes That Help SEO

- Keep public job pages indexable.
- Encourage freelancers to complete public profiles.
- Add service/category pages for each high-value role.
- Add recently posted public jobs on the homepage.
- Add featured freelancer profiles on the homepage.
- Add real reviews/testimonials only when available.

## Freelancer Profile Optimization Email Campaign

Goal: convince freelancers to improve their profiles so TaraWork looks more professional to employers and public profile pages become stronger SEO assets.

Recommended audience:

- Freelancers with missing or short bio.
- Freelancers with fewer than 3 skills.
- Freelancers with no avatar or portfolio project.
- Freelancers with no hourly rate or unclear category.
- Freelancers who signed up but have not updated their profile in 7 days.

Do not send one generic blast to everyone. Segment users by what is missing and make the email feel specific.

Email sequence:

1. Day 0: Profile improvement reminder.
2. Day 3: Portfolio and proof reminder.
3. Day 7: Final visibility reminder.

Email 1 subject options:

- Improve your TaraWork profile so employers can trust you faster
- Your TaraWork profile can get more professional in 10 minutes
- A stronger profile helps employers understand what you offer

Email 1 copy:

Subject: Improve your TaraWork profile so employers can trust you faster

Hi {{name}},

Your TaraWork profile is your public freelancer page. Employers use it to decide if they should message, invite, or shortlist you.

Right now, your profile can be stronger if you add:

- A clear professional headline or service category.
- A short bio that explains what you do and who you help.
- 5 to 10 relevant skills.
- At least 1 portfolio project or work sample.
- Your rate or preferred project type.

Profiles with clear services, proof of work, and complete details look more trustworthy and are easier for employers to compare.

Update your profile here:
{{profile_edit_url}}

TaraWork Team

Email 2 subject options:

- Add proof of work to make your profile easier to hire from
- Employers need proof before they shortlist freelancers
- Your portfolio can make your TaraWork profile stronger

Email 2 copy:

Subject: Add proof of work to make your profile easier to hire from

Hi {{name}},

Employers do not only look at skills. They also want proof that you can do the work.

Add 1 to 3 examples to your TaraWork profile:

- Previous project results.
- Screenshots or links to work samples.
- Tools you used.
- The problem you helped solve.
- A short explanation of your role.

Even one clear project can make your profile feel more professional.

Update your portfolio here:
{{profile_edit_url}}

TaraWork Team

Email 3 subject options:

- Last reminder: make your TaraWork profile ready for employers
- Complete profiles are easier for employers to trust
- Finish your TaraWork profile before sharing it with clients

Email 3 copy:

Subject: Last reminder: make your TaraWork profile ready for employers

Hi {{name}},

Before you share your TaraWork profile with employers, make sure it answers these questions:

- What service do you offer?
- What tools or skills do you use?
- What kind of client or business can you help?
- What proof of work can employers review?
- How can employers understand your rate or availability?

A complete profile gives employers fewer reasons to skip and more reasons to start a conversation.

Finish your profile here:
{{profile_edit_url}}

TaraWork Team

Implementation notes:

- Use the existing SMTP setup only for low-volume sending.
- Add unsubscribe or email preference handling before sending recurring campaigns.
- Rate-limit campaign sending to protect the TaraWork email domain.
- Track `last_profile_nudge_sent_at` and `profile_nudge_count` before sending repeats.
- Prefer a preview-and-send admin tool over automatic mass email at first.
- Avoid sending to users who have unsubscribed, bounced, or recently completed their profile.

## What Not To Do

- Do not add fake reviews or fake ratings.
- Do not keyword-stuff paragraphs.
- Do not buy spammy backlinks.
- Do not index dashboards, messages, admin pages, API routes, callbacks, or webhook URLs.
- Do not send profile reminder emails without unsubscribe or preference controls.
