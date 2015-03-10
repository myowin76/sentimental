class AddScoreToClientSurveys < ActiveRecord::Migration
  def change
    add_column :client_surveys, :score, :integer
  end
end
