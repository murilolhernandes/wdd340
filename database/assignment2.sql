-- 5.1.
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 5.2.
UPDATE public.account
SET account_type = 'Admin';

-- 5.3.
DELETE FROM public.account
WHERE account_lastname = 'Stark';

-- 5.4.
UPDATE public.inventory
SET inv_description = REPLACE(inv_description,'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- To find the changes:
SELECT * FROM public.inventory
WHERE inv_model = 'Hummer';

-- 5.5.
SELECT inv_make, inv_model, classification_name
FROM public.inventory i
	JOIN public.classification c
	ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';


-- 5.6.
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- To find the changes:
SELECT inv_image, inv_thumbnail FROM public.inventory;

-- 5.7.