class Admin::CountriesController < AdminController
  before_action :set_admin_country, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @admin_countries = Admin::Country.all
    respond_with(@admin_countries)
  end

  def show
    respond_with(@admin_country)
  end

  def new
    @admin_country = Admin::Country.new
    respond_with(@admin_country)
  end

  def edit
  end

  def create
    @admin_country = Admin::Country.new(country_params)
    @admin_country.save
    respond_with(@admin_country)
  end

  def update
    @admin_country.update(country_params)
    respond_with(@admin_country)
  end

  def destroy
    @admin_country.destroy
    respond_with(@admin_country)
  end

  private
    def set_admin_country
      @admin_country = Admin::Country.find(params[:id])
    end

    def admin_country_params
      params.require(:admin_country).permit(:name)
    end
end
