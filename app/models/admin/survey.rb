class Admin::Survey < ActiveRecord::Base
	belongs_to :user
	has_many :client_surveys

	accepts_nested_attributes_for :client_surveys	#, :allow_destroy => true



	private
	
	def generate_url(column)
	  begin
	    self[column] = SecureRandom.urlsafe_base64
	  end while Admin::User.exists?(column => self[column])
	end
end
