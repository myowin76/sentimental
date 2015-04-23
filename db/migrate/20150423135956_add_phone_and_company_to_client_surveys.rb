class AddPhoneAndCompanyToClientSurveys < ActiveRecord::Migration
  def change
    add_column :client_surveys, :phone, :string
    add_column :client_surveys, :company, :string
  end
end
