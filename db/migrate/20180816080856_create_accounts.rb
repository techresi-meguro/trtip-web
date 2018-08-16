class CreateAccounts < ActiveRecord::Migration[5.0]
  def change
    create_table :accounts do |t|
      t.string :slack_user_id
      t.string :ethereum_address

      t.timestamps
    end
  end
end
