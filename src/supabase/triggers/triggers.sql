-- Drop the trigger if it exists
drop trigger IF exists after_user_insert on users;

drop function IF exists increment_count_and_set_username () CASCADE;

-- Drop the trigger and function if they exist
drop trigger IF exists after_user_insert_notifications on users;

drop function IF exists initialize_notification_settings () CASCADE;

-- Drop trigger and function if they already exist
drop trigger IF exists after_user_insert_privacy on users;

drop function IF exists initialize_privacy_settings () CASCADE;

create
or replace function increment_count_and_set_username () RETURNS trigger as $$
DECLARE
    current_count integer;
BEGIN
    -- Increment the user count in the user_count table
    UPDATE user_count 
       SET user_count = user_count + 1
      WHERE id = 1;  
    
    -- Retrieve the new count value
    SELECT user_count INTO current_count FROM user_count;
    
    -- Update the inserted user's user_name field to "user" concatenated with the current count
    UPDATE users 
      SET user_name = NEW.display_name || current_count
      WHERE user_id = NEW.user_id;
      
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires after each insert on the users table
create trigger after_user_insert
after INSERT on users for EACH row
execute FUNCTION increment_count_and_set_username ();

-- Create the function to initialize notification settings for a new user
create
or replace function initialize_notification_settings () RETURNS trigger as $$
BEGIN
  INSERT INTO notification_settings(user_id)
  VALUES (NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires after each insert on the users table
create trigger after_user_insert_notifications
after INSERT on users for EACH row
execute FUNCTION initialize_notification_settings ();

-- Create the function to initialize privacy settings for a new user
create
or replace function initialize_privacy_settings () RETURNS trigger as $$
BEGIN
  INSERT INTO privacy_settings(user_id)
  VALUES (NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to fire after an insert on the users table
create trigger after_user_insert_privacy
after INSERT on users for EACH row
execute FUNCTION initialize_privacy_settings ();