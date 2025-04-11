drop function IF exists add_push_token (TEXT, TEXT);

drop function IF exists remove_push_token (TEXT, TEXT);

create
or replace function add_push_token (push_token TEXT, p_user_id TEXT) RETURNS VOID as $$
BEGIN
    UPDATE users
    SET push_tokens = CASE
                        WHEN push_token NOT IN (SELECT unnest(push_tokens)) THEN array_append(push_tokens, push_token)
                        ELSE push_tokens
                      END
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

create
or replace function remove_push_token (push_token TEXT, p_user_id TEXT) RETURNS VOID as $$
BEGIN
    UPDATE users
    SET push_tokens = array_remove(push_tokens, push_token)
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;