class ChangeColumnToAccount < ActiveRecord::Migration[5.0]
  def change
    rename_column :accounts, :slack_user_id, :slack_user_id_string
  end
end
