class ChangeDatatypeOfAccounts < ActiveRecord::Migration[5.0]
  def change
    change_column :accounts, :slack_user_id, :text
    change_column :accounts, :ethereum_address, :text
  end
end
