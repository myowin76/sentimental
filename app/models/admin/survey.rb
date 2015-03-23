class Admin::Survey < ActiveRecord::Base
	belongs_to :user
	has_many :client_surveys

	accepts_nested_attributes_for :client_surveys	#, :allow_destroy => true


	def self.search(search)
		if search
			where("text LIKE", "%#{search}")
		else
			find(:all)
		end	
	end
		

	private
	
	def generate_url(column)
	  begin
	    self[column] = SecureRandom.urlsafe_base64
	  end while Admin::User.exists?(column => self[column])
	end
end
