class CreateClientSurveys < ActiveRecord::Migration
  def change
    create_table :client_surveys do |t|
      t.text :text
      t.string :name
      t.string :email
      t.references :survey, index: true

      t.timestamps
    end
  end
end
