class AddIndexToAccounts < ActiveRecord::Migration[5.0]
  def change
    add_index :accounts, :slack_user_id_string, :unique => true
  end
end
