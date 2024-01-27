class CreateCompanies < ActiveRecord::Migration[7.0]
  def change
    create_table :companies do |t|
      t.references :owner, null: false, foreign_key: { to_table: :users }
      t.string :name

      t.timestamps
    end
  end
end
