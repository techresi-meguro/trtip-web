class Account < ApplicationRecord
  attribute :ethereum_address, :text
  attribute :slack_user_id_string, :text
end
