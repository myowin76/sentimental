class Admin::Survey < ActiveRecord::Base
	belongs_to :user
	has_many :client_surveys

	accepts_nested_attributes_for :client_surveys	#, :allow_destroy => true
end
